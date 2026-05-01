from __future__ import annotations

import json
import sqlite3
import time
from pathlib import Path
from typing import Any


class SessionStore:
    def __init__(self, db_path: str | Path) -> None:
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._initialized = False

    def initialize(self) -> None:
        if self._initialized:
            return
        with sqlite3.connect(self.db_path) as connection:
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS metrics (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    created_at INTEGER NOT NULL,
                    payload TEXT NOT NULL
                )
                """
            )
            connection.commit()
        self._initialized = True

    def insert_metrics(self, metrics: dict[str, Any]) -> None:
        self.initialize()
        payload = json.dumps(metrics)
        with sqlite3.connect(self.db_path) as connection:
            connection.execute(
                "INSERT INTO metrics (created_at, payload) VALUES (?, ?)",
                (int(time.time()), payload),
            )
            connection.commit()

    def get_recent_metrics(self, limit: int = 120) -> list[dict[str, Any]]:
        self.initialize()
        with sqlite3.connect(self.db_path) as connection:
            rows = connection.execute(
                "SELECT payload FROM metrics ORDER BY created_at DESC, id DESC LIMIT ?",
                (limit,),
            ).fetchall()
        return [json.loads(row[0]) for row in rows]

    def get_summary(self) -> dict[str, Any]:
        self.initialize()
        rows = self.get_recent_metrics(limit=500)
        if not rows:
            return {
                "samples": 0,
                "average_risk_score": 0,
                "danger_rate": 0,
                "warning_rate": 0,
                "insight": "No recent driving data captured yet.",
            }
        total = len(rows)
        average_risk = sum(float(row.get("risk_score", 0)) for row in rows) / total
        danger = sum(1 for row in rows if row.get("status") == "DANGER") / total
        warning = sum(1 for row in rows if row.get("status") == "WARNING") / total
        distraction = sum(
            1
            for row in rows
            if row.get("phone_detected") or row.get("looking_away") or row.get("yawning")
        ) / total
        return {
            "samples": total,
            "average_risk_score": round(average_risk, 2),
            "danger_rate": round(danger, 3),
            "warning_rate": round(warning, 3),
            "distraction_rate": round(distraction, 3),
            "insight": f"Driver was distracted {distraction:.0%} of the time across the latest samples.",
        }
