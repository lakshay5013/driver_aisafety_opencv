# AI Driver Monitoring System with Tesla-Style Dashboard

This repository contains the backend foundation for a real-time driver safety system built with FastAPI, OpenCV, MediaPipe, and YOLOv8.

The frontend lives under `frontend/` and is built with React, TypeScript, TailwindCSS, Framer Motion, Recharts, and Axios.

## Backend

The backend lives under `backend/` and provides:

- `POST /start-camera` to start the webcam processing loop
- `POST /stop-camera` to stop the webcam processing loop
- `GET /video-feed` for MJPEG video streaming
- `GET /metrics` for real-time driver safety metrics
- `GET /session-summary` for stored session insights
- `WS /ws/metrics` for live WebSocket updates

### Detection logic

The backend computes:

- Eye Aspect Ratio for drowsiness detection
- Blink rate over the last minute
- Mouth Aspect Ratio for yawning detection
- Head pose estimation for looking-away detection
- YOLOv8 detections for phone use, drowsiness, and distraction classes

### Risk score

The risk score is normalized to a 0-100 range and uses the requested weights:

- Eyes closed: +40
- Yawning: +30
- Phone detected: +50
- Looking away: +30
- Sleeping: +40

### YOLOv8 training

The YOLO training files are in `backend/train.py` and `backend/dataset.yaml`.

Run training with:

```bash
yolo detect train data=backend/dataset.yaml model=yolov8n.pt epochs=20
```

Or use the scripted trainer:

```bash
python backend/train.py --data backend/dataset.yaml --model yolov8n.pt --epochs 20
```

### Model output

The trained model should be saved to:

`backend/models/best.pt`

### Dataset structure

Recommended layout:

```text
backend/dataset/
  images/
    train/
    val/
  labels/
    train/
    val/
```

Annotate the dataset using Roboflow or LabelImg, then export YOLO format labels.

### Run the backend

Install dependencies and start the API:

```bash
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

### Run the frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Set `VITE_API_URL` in `frontend/.env` if the backend is not available on `http://localhost:8000`.

### Environment variables

- `CAMERA_INDEX` - webcam index, default `0`
- `YOLO_MODEL_PATH` - path to the YOLO checkpoint, default `backend/models/best.pt`
- `SESSION_DB_PATH` - SQLite file path, default `backend/data/driver_sessions.db`
- `CORS_ORIGINS` - comma-separated origins, default `*`


##python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

