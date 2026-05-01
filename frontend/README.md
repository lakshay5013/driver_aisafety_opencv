# Frontend

Tesla-inspired React dashboard for the AI Driver Monitoring System.

## Stack

- React + TypeScript
- Vite
- TailwindCSS
- Framer Motion
- Recharts
- Axios

## Features

- Dashboard, Live Monitoring, and Analytics pages
- Real-time WebSocket metrics
- MJPEG live video feed
- Circular risk meter
- Blink-rate trend chart
- Animated alert banner
- Browser speech alerts when risk exceeds the danger threshold

## Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL` if the backend is not running on `http://localhost:8000`.

## Backend contract

The frontend expects these endpoints:

- `POST /start-camera`
- `POST /stop-camera`
- `GET /video-feed`
- `GET /metrics`
- `GET /session-summary`
- `WS /ws/metrics`
