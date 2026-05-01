from __future__ import annotations

import math
import os
import threading
import time
from collections import deque
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib.request import urlretrieve

import cv2
import mediapipe as mp
import numpy as np
from ultralytics import YOLO

from backend.utils.session_store import SessionStore


LEFT_EYE = [33, 160, 158, 133, 153, 144]
RIGHT_EYE = [362, 385, 387, 263, 373, 380]
MOUTH = [61, 81, 13, 311, 291, 308]
HEAD_POSE_2D = [1, 152, 33, 263, 61, 291]
HEAD_POSE_3D = np.array(
    [
        (0.0, 0.0, 0.0),
        (0.0, -63.6, -12.5),
        (-43.3, 32.7, -26.0),
        (43.3, 32.7, -26.0),
        (-28.9, -28.9, -24.1),
        (28.9, -28.9, -24.1),
    ],
    dtype=np.float64,
)
FACE_LANDMARK_MODEL_URL = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"


@dataclass
class DetectionSnapshot:
    ear: float = 0.0
    mar: float = 0.0
    blink_rate: float = 0.0
    risk_score: int = 0
    status: str = "SAFE"
    eyes_closed: bool = False
    yawning: bool = False
    phone_detected: bool = False
    sleeping: bool = False
    looking_away: bool = False
    distraction_score: float = 0.0
    insights: list[str] | None = None


class DriverMonitor:
    def __init__(
        self,
        camera_index: int = 0,
        model_path: str | os.PathLike[str] = "backend/models/best.pt",
        session_store: SessionStore | None = None,
        ear_threshold: float = 0.23,
        mar_threshold: float = 0.65,
        blink_reset_seconds: float = 1.5,
    ) -> None:
        self.camera_index = camera_index
        self.model_path = Path(model_path)
        self.session_store = session_store
        self.ear_threshold = ear_threshold
        self.mar_threshold = mar_threshold
        self.blink_reset_seconds = blink_reset_seconds

        self._capture: cv2.VideoCapture | None = None
        self._frame_lock = threading.Lock()
        self._state_lock = threading.Lock()
        self._running = False
        self._thread: threading.Thread | None = None
        self._last_frame: np.ndarray | None = None
        self._latest_snapshot = DetectionSnapshot()
        self._last_saved_at = 0.0
        self._last_yolo_frame_at = 0.0
        self._yolo_interval_seconds = 0.5
        self._blink_open = False
        self._blink_timestamps: deque[float] = deque(maxlen=300)
        self._frame_counter = 0
        self._recent_status_counts = {"SAFE": 0, "WARNING": 0, "DANGER": 0}
        self._total_frames = 0
        self._problem_frames = 0
        self._model: YOLO | None = None
        self._fallback_phone_model: YOLO | None = None
        self._face_landmarker = None
        self._looking_away_start_time: float | None = None
        self._load_face_landmarker()

    def initialize(self) -> None:
        self._load_model()
        if self.session_store is not None:
            self.session_store.initialize()

    def _load_model(self) -> None:
        if self._model is not None:
            return
        if self.model_path.exists():
            self._model = YOLO(str(self.model_path))
        else:
            self._model = None

    def _load_fallback_phone_model(self) -> None:
        if self._fallback_phone_model is not None:
            return
        try:
            self._fallback_phone_model = YOLO("yolov8n.pt")
        except Exception:
            self._fallback_phone_model = None

    def _load_face_landmarker(self) -> None:
        if self._face_landmarker is not None:
            return

        self.model_path.parent.mkdir(parents=True, exist_ok=True)
        face_model_path = self.model_path.parent / "face_landmarker.task"
        if not face_model_path.exists():
            try:
                urlretrieve(FACE_LANDMARK_MODEL_URL, face_model_path)
            except Exception:
                self._face_landmarker = None
                return

        try:
            options = mp.tasks.vision.FaceLandmarkerOptions(
                base_options=mp.tasks.BaseOptions(model_asset_path=str(face_model_path)),
                running_mode=mp.tasks.vision.RunningMode.IMAGE,
                num_faces=1,
                min_face_detection_confidence=0.5,
                min_face_presence_confidence=0.5,
                min_tracking_confidence=0.5,
            )
            self._face_landmarker = mp.tasks.vision.FaceLandmarker.create_from_options(options)
        except Exception:
            self._face_landmarker = None

    def is_running(self) -> bool:
        return self._running

    def start(self) -> dict[str, object]:
        if self._running:
            return {"status": "already_running", "camera_index": self.camera_index}

        if self._thread is not None and self._thread.is_alive():
            self._thread.join(timeout=1.0)

        self._load_face_landmarker()

        self._capture = cv2.VideoCapture(self.camera_index)
        if not self._capture.isOpened():
            self._capture.release()
            self._capture = None
            return {"status": "error", "message": f"Unable to open camera index {self.camera_index}"}

        self._running = True
        self._thread = threading.Thread(target=self._run_loop, daemon=True)
        self._thread.start()
        return {"status": "started", "camera_index": self.camera_index}

    def stop(self) -> dict[str, object]:
        self._running = False
        if self._capture is not None:
            self._capture.release()
            self._capture = None
        if self._face_landmarker is not None:
            close = getattr(self._face_landmarker, "close", None)
            if callable(close):
                close()
            self._face_landmarker = None
        if self._thread is not None and self._thread.is_alive():
            self._thread.join(timeout=1.0)
        self._thread = None
        return {"status": "stopped"}

    def mjpeg_stream(self):
        while True:
            if not self._running:
                break
            frame = self.get_frame()
            if frame is None:
                time.sleep(0.03)
                continue
            encoded, buffer = cv2.imencode(".jpg", frame)
            if not encoded:
                time.sleep(0.03)
                continue
            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n" + buffer.tobytes() + b"\r\n"
            )
            time.sleep(0.03)

    def get_frame(self) -> np.ndarray | None:
        with self._frame_lock:
            if self._last_frame is None:
                return None
            return self._last_frame.copy()

    def get_metrics(self) -> dict[str, Any]:
        snapshot = self._latest_snapshot
        return {
            "blink_rate": round(snapshot.blink_rate, 2),
            "ear": round(snapshot.ear, 3),
            "risk_score": int(snapshot.risk_score),
            "status": snapshot.status,
            "yawning": snapshot.yawning,
            "phone_detected": snapshot.phone_detected,
            "sleeping": snapshot.sleeping,
            "looking_away": snapshot.looking_away,
            "eyes_closed": snapshot.eyes_closed,
            "insights": snapshot.insights or [],
        }

    def get_session_summary(self) -> dict[str, Any]:
        summary = {
            "frames": self._total_frames,
            "problem_frames": self._problem_frames,
            "risk_distribution": self._recent_status_counts,
            "insights": self._latest_snapshot.insights or [],
        }
        if self.session_store is not None:
            summary["database"] = self.session_store.get_summary()
        return summary

    def _run_loop(self) -> None:
        capture = self._capture
        assert capture is not None
        while self._running and capture.isOpened():
            ok, frame = capture.read()
            if not ok or frame is None:
                time.sleep(0.02)
                continue
            processed, snapshot = self._analyze_frame(frame)
            with self._frame_lock:
                self._last_frame = processed
            with self._state_lock:
                self._latest_snapshot = snapshot
                self._total_frames += 1
                if snapshot.status != "SAFE":
                    self._problem_frames += 1
                self._recent_status_counts[snapshot.status] += 1
            self._maybe_store_snapshot(snapshot)
        if capture.isOpened():
            capture.release()
        if self._capture is capture:
            self._capture = None

    def _maybe_store_snapshot(self, snapshot: DetectionSnapshot) -> None:
        if self.session_store is None:
            return
        now = time.time()
        if now - self._last_saved_at < 1.0:
            return
        self._last_saved_at = now
        self.session_store.insert_metrics(
            {
                "blink_rate": snapshot.blink_rate,
                "ear": snapshot.ear,
                "risk_score": snapshot.risk_score,
                "status": snapshot.status,
                "eyes_closed": snapshot.eyes_closed,
                "yawning": snapshot.yawning,
                "phone_detected": snapshot.phone_detected,
                "sleeping": snapshot.sleeping,
                "looking_away": snapshot.looking_away,
            }
        )

    def _analyze_frame(self, frame: np.ndarray) -> tuple[np.ndarray, DetectionSnapshot]:
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = self._detect_face_landmarks(rgb)
        annotated = frame.copy()
        snapshot = DetectionSnapshot(insights=[])

        if result:
            landmarks = result
            height, width = frame.shape[:2]
            snapshot.ear = self._calculate_average_ear(landmarks, width, height)
            snapshot.mar = self._calculate_mar(landmarks, width, height)
            snapshot.eyes_closed = snapshot.ear < self.ear_threshold
            snapshot.yawning = snapshot.mar > self.mar_threshold
            snapshot.looking_away = self._estimate_looking_away(landmarks, width, height)
            self._update_blink_rate(snapshot)
            annotated = self._draw_landmarks(annotated, landmarks)
        else:
            snapshot.looking_away = False

        yolo_prediction = self._run_yolo_detection(annotated)
        snapshot.phone_detected = yolo_prediction.get("phone", False)
        snapshot.sleeping = yolo_prediction.get("drowsy", False)

        snapshot.risk_score = self._calculate_risk_score(snapshot)
        snapshot.status = self._risk_status(snapshot.risk_score)
        snapshot.insights = self._build_insights(snapshot)
        annotated = self._overlay_status(annotated, snapshot)
        return annotated, snapshot

    def _detect_face_landmarks(self, rgb_frame: np.ndarray):
        if self._face_landmarker is None:
            return None
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
        result = self._face_landmarker.detect(mp_image)
        if not result.face_landmarks:
            return None
        return result.face_landmarks[0]

    def _calculate_average_ear(self, landmarks, width: int, height: int) -> float:
        left = self._eye_aspect_ratio(landmarks, LEFT_EYE, width, height)
        right = self._eye_aspect_ratio(landmarks, RIGHT_EYE, width, height)
        return (left + right) / 2.0

    def _eye_aspect_ratio(self, landmarks, eye_indices: list[int], width: int, height: int) -> float:
        points = [self._landmark_to_point(landmarks[idx], width, height) for idx in eye_indices]
        vertical_1 = np.linalg.norm(points[1] - points[5])
        vertical_2 = np.linalg.norm(points[2] - points[4])
        horizontal = np.linalg.norm(points[0] - points[3])
        if horizontal == 0:
            return 0.0
        return float((vertical_1 + vertical_2) / (2.0 * horizontal))

    def _calculate_mar(self, landmarks, width: int, height: int) -> float:
        top = self._landmark_to_point(landmarks[13], width, height)
        bottom = self._landmark_to_point(landmarks[14], width, height)
        left = self._landmark_to_point(landmarks[61], width, height)
        right = self._landmark_to_point(landmarks[291], width, height)
        vertical = np.linalg.norm(top - bottom)
        horizontal = np.linalg.norm(left - right)
        if horizontal == 0:
            return 0.0
        return float(vertical / horizontal)

    def _estimate_looking_away(self, landmarks, width: int, height: int) -> bool:
        image_points = np.array(
            [
                self._landmark_to_point(landmarks[idx], width, height)
                for idx in HEAD_POSE_2D
            ],
            dtype=np.float64,
        )
        focal_length = width
        center = (width / 2.0, height / 2.0)
        camera_matrix = np.array(
            [
                [focal_length, 0, center[0]],
                [0, focal_length, center[1]],
                [0, 0, 1],
            ],
            dtype=np.float64,
        )
        dist_coeffs = np.zeros((4, 1), dtype=np.float64)
        success, rotation_vec, translation_vec = cv2.solvePnP(
            HEAD_POSE_3D,
            image_points,
            camera_matrix,
            dist_coeffs,
            flags=cv2.SOLVEPNP_ITERATIVE,
        )
        if not success:
            self._looking_away_start_time = None
            return False
        rotation_matrix, _ = cv2.Rodrigues(rotation_vec)
        euler_angles, _, _, _, _, _ = cv2.RQDecomp3x3(rotation_matrix)
        pitch, yaw, roll = euler_angles
        is_looking_away_now = abs(yaw) > 35

        if is_looking_away_now:
            if self._looking_away_start_time is None:
                self._looking_away_start_time = time.time()
            return (time.time() - self._looking_away_start_time) >= 1.5

        self._looking_away_start_time = None
        return False

    def _run_yolo_detection(self, frame: np.ndarray) -> dict[str, bool]:
        detections = {"phone": False, "drowsy": False, "looking_away": False}
        if self._model is None:
            self._load_fallback_phone_model()
            return self._run_phone_fallback(frame, detections)
        now = time.time()
        if now - self._last_yolo_frame_at < self._yolo_interval_seconds:
            return detections
        self._last_yolo_frame_at = now
        results = self._model.predict(frame, verbose=False)
        if not results:
            return detections
        boxes = results[0].boxes
        if boxes is None:
            return detections
        names = results[0].names
        for box in boxes:
            class_id = int(box.cls[0])
            label = self._normalize_label(str(names.get(class_id, "")))
            confidence = float(box.conf[0])
            if confidence < self._confidence_threshold(label):
                continue
            if self._is_phone_label(label):
                detections["phone"] = True
            elif self._is_drowsy_label(label):
                detections["drowsy"] = True
            elif self._is_looking_away_label(label):
                detections["looking_away"] = True
            elif label in detections:
                detections[label] = True

        if not detections["phone"]:
            self._load_fallback_phone_model()
            self._run_phone_fallback(frame, detections)
        return detections

    def _run_phone_fallback(self, frame: np.ndarray, detections: dict[str, bool]) -> dict[str, bool]:
        if self._fallback_phone_model is None:
            return detections
        try:
            results = self._fallback_phone_model.predict(frame, verbose=False)
            if not results:
                return detections
            boxes = results[0].boxes
            if boxes is None:
                return detections
            names = results[0].names
            for box in boxes:
                class_id = int(box.cls[0])
                label = self._normalize_label(str(names.get(class_id, "")))
                confidence = float(box.conf[0])
                if label in {"cell phone", "mobile phone", "phone"} and confidence >= 0.25:
                    detections["phone"] = True
                    break
        except Exception:
            return detections
        return detections

    def _normalize_label(self, label: str) -> str:
        return label.strip().lower().replace("_", " ")

    def _confidence_threshold(self, label: str) -> float:
        if self._is_phone_label(label):
            return 0.25
        if self._is_drowsy_label(label):
            return 0.3
        return 0.4

    def _is_phone_label(self, label: str) -> bool:
        return label in {"phone", "cell phone", "mobile phone", "cellphone", "mobilephone"}

    def _is_drowsy_label(self, label: str) -> bool:
        return label in {"drowsy", "sleepy", "sleeping"}

    def _is_looking_away_label(self, label: str) -> bool:
        return label in {"looking away", "looking_away", "distraction", "distracted"}

    def _update_blink_rate(self, snapshot: DetectionSnapshot) -> None:
        now = time.time()
        if snapshot.eyes_closed:
            self._blink_open = True
            return
        if self._blink_open:
            self._blink_open = False
            self._blink_timestamps.append(now)
        while self._blink_timestamps and now - self._blink_timestamps[0] > 60:
            self._blink_timestamps.popleft()
        snapshot.blink_rate = float(len(self._blink_timestamps))

    def _calculate_risk_score(self, snapshot: DetectionSnapshot) -> int:
        score = 0
        if snapshot.eyes_closed:
            score += 40
        if snapshot.yawning:
            score += 30
        if snapshot.phone_detected:
            score += 50
        if snapshot.looking_away:
            score += 30
        if snapshot.sleeping:
            score += 40
        return min(score, 100)

    def _risk_status(self, score: int) -> str:
        if score < 35:
            return "SAFE"
        if score < 70:
            return "WARNING"
        return "DANGER"

    def _build_insights(self, snapshot: DetectionSnapshot) -> list[str]:
        insights: list[str] = []
        if self._total_frames > 0:
            distracted_frames = self._problem_frames / self._total_frames
            insights.append(f"Driver was distracted {distracted_frames:.0%} of the time")
        if snapshot.phone_detected:
            insights.append("Phone usage detected during the current monitoring window")
        if snapshot.sleeping:
            insights.append("Sleeping behavior detected")
        if snapshot.yawning:
            insights.append("Frequent yawning may indicate fatigue")
        if snapshot.looking_away:
            insights.append("Driver gaze is away from the road")
        return insights

    def _overlay_status(self, frame: np.ndarray, snapshot: DetectionSnapshot) -> np.ndarray:
        height, width = frame.shape[:2]
        overlay = frame.copy()
        cv2.rectangle(overlay, (0, 0), (width, 120), (10, 10, 18), -1)
        alpha = 0.78
        frame = cv2.addWeighted(overlay, alpha, frame, 1 - alpha, 0)
        color = (0, 200, 0)
        if snapshot.status == "WARNING":
            color = (0, 200, 255)
        elif snapshot.status == "DANGER":
            color = (0, 0, 255)
        cv2.putText(frame, f"STATUS: {snapshot.status}", (24, 38), cv2.FONT_HERSHEY_SIMPLEX, 1.0, color, 2)
        cv2.putText(frame, f"EAR: {snapshot.ear:.3f}", (24, 72), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (255, 255, 255), 2)
        cv2.putText(frame, f"Blink/min: {snapshot.blink_rate:.0f}", (240, 72), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (255, 255, 255), 2)
        cv2.putText(frame, f"Risk Score: {snapshot.risk_score}", (460, 72), cv2.FONT_HERSHEY_SIMPLEX, 0.75, color, 2)
        self._draw_alert_badges(frame, snapshot)
        return frame

    def _draw_alert_badges(self, frame: np.ndarray, snapshot: DetectionSnapshot) -> None:
        flags = [
            ("PHONE", snapshot.phone_detected),
            ("DROWSY", snapshot.sleeping or snapshot.eyes_closed),
            ("YAWN", snapshot.yawning),
            ("LOOK AWAY", snapshot.looking_away),
        ]
        x = 24
        for label, active in flags:
            color = (60, 60, 60) if not active else (0, 0, 255)
            text_color = (200, 200, 200) if not active else (255, 255, 255)
            width = 15 + len(label) * 13
            cv2.rectangle(frame, (x, 86), (x + width, 114), color, -1)
            cv2.putText(frame, label, (x + 8, 106), cv2.FONT_HERSHEY_SIMPLEX, 0.5, text_color, 1)
            x += width + 10

    def _draw_landmarks(self, frame: np.ndarray, landmarks) -> np.ndarray:
        height, width = frame.shape[:2]
        for idx in LEFT_EYE + RIGHT_EYE + MOUTH:
            point = self._landmark_to_point(landmarks[idx], width, height)
            cv2.circle(frame, tuple(point.astype(int)), 1, (0, 255, 0), -1)
        return frame

    def _landmark_to_point(self, landmark, width: int, height: int) -> np.ndarray:
        return np.array([landmark.x * width, landmark.y * height], dtype=np.float64)
