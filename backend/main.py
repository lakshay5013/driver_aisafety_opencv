from __future__ import annotations

import asyncio
import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse

from backend.detection.driver_monitor import DriverMonitor
from backend.utils.session_store import SessionStore


CAMERA_INDEX = int(os.getenv("CAMERA_INDEX", "0"))
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.getenv("YOLO_MODEL_PATH", os.path.join(BASE_DIR, "models", "best.pt"))
DB_PATH = os.getenv("SESSION_DB_PATH", os.path.join(BASE_DIR, "data", "driver_sessions.db"))
ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")

monitor = DriverMonitor(
    camera_index=CAMERA_INDEX,
    model_path=MODEL_PATH,
    session_store=SessionStore(DB_PATH),
)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    monitor.initialize()
    yield
    monitor.stop()


app = FastAPI(
    title="AI Driver Monitoring System",
    version="1.0.0",
    description="Real-time driver safety monitoring using OpenCV, MediaPipe, and YOLOv8.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin for origin in ALLOWED_ORIGINS if origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict[str, str]:
    return {
        "service": "AI Driver Monitoring System",
        "status": "running",
    }


@app.get("/health")
def health() -> dict[str, object]:
    return {
        "status": "ok",
        "camera_running": monitor.is_running(),
    }


@app.post("/start-camera")
def start_camera() -> dict[str, object]:
    result = monitor.start()
    return result


@app.post("/stop-camera")
def stop_camera() -> dict[str, object]:
    result = monitor.stop()
    return result


@app.get("/video-feed")
def video_feed() -> StreamingResponse:
    return StreamingResponse(
        monitor.mjpeg_stream(),
        media_type="multipart/x-mixed-replace; boundary=frame",
    )


@app.get("/metrics")
def metrics() -> JSONResponse:
    return JSONResponse(monitor.get_metrics())


@app.get("/session-summary")
def session_summary() -> JSONResponse:
    return JSONResponse(monitor.get_session_summary())


@app.websocket("/ws/metrics")
async def websocket_metrics(websocket: WebSocket) -> None:
    await websocket.accept()
    try:
        while True:
            await websocket.send_json(monitor.get_metrics())
            await asyncio.sleep(0.5)
    except WebSocketDisconnect:
        return
    except Exception:
        await websocket.close()
