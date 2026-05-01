import { useEffect, useMemo, useRef, useState } from 'react';
import { api, wsUrl } from '../lib/api';

export type DriverStatus = 'SAFE' | 'WARNING' | 'DANGER';

export interface DriverMetrics {
  blink_rate: number;
  ear: number;
  risk_score: number;
  status: DriverStatus;
  yawning?: boolean;
  phone_detected?: boolean;
  sleeping?: boolean;
  looking_away?: boolean;
  eyes_closed?: boolean;
  insights?: string[];
}

export interface SessionSummary {
  samples: number;
  average_risk_score: number;
  danger_rate: number;
  warning_rate: number;
  distraction_rate: number;
  insight: string;
}

const emptyMetrics: DriverMetrics = {
  blink_rate: 0,
  ear: 0,
  risk_score: 0,
  status: 'SAFE',
  insights: [],
};

export function useDriverMonitoring() {
  const [metrics, setMetrics] = useState<DriverMetrics>(emptyMetrics);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'offline'>('connecting');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const spokenAlertRef = useRef(false);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: number | null = null;
    let stopped = false;

    const connect = async () => {
      try {
        const response = await api.get<DriverMetrics>('/metrics');
        if (!stopped) {
          setMetrics(response.data);
          setHistory((current) => [...current.slice(-29), response.data.risk_score]);
        }
      } catch {
        if (!stopped) {
          setConnectionState('offline');
        }
      }

      if (stopped) {
        return;
      }

      ws = new WebSocket(wsUrl);
      ws.onopen = () => {
        setIsConnected(true);
        setConnectionState('connected');
      };
      ws.onmessage = (event) => {
        const payload = JSON.parse(event.data) as DriverMetrics;
        setMetrics(payload);
        setHistory((current) => [...current.slice(-29), payload.risk_score]);

        const shouldAlert = payload.risk_score > 70;
        if (shouldAlert) {
          setAlertMessage('High risk detected. Stay focused and keep both hands on the wheel.');
          if (typeof window !== 'undefined' && 'speechSynthesis' in window && !spokenAlertRef.current) {
            spokenAlertRef.current = true;
            const utterance = new SpeechSynthesisUtterance('Attention. High driver risk detected. Please focus on the road.');
            utterance.rate = 1.02;
            utterance.pitch = 1.0;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
          }
        } else {
          setAlertMessage(null);
          spokenAlertRef.current = false;
        }
      };
      ws.onerror = () => {
        setConnectionState('offline');
      };
      ws.onclose = () => {
        setIsConnected(false);
        if (!stopped) {
          setConnectionState('offline');
          reconnectTimer = window.setTimeout(connect, 1500);
        }
      };
    };

    connect();

    const summaryTimer = window.setInterval(async () => {
      try {
        const response = await api.get<SessionSummary>('/session-summary');
        setSummary(response.data);
      } catch {
        setSummary(null);
      }
    }, 3000);

    return () => {
      stopped = true;
      if (reconnectTimer) {
        window.clearTimeout(reconnectTimer);
      }
      window.clearInterval(summaryTimer);
      ws?.close();
    };
  }, []);

  const statusTone = useMemo(() => {
    if (metrics.status === 'DANGER') return 'red';
    if (metrics.status === 'WARNING') return 'amber';
    return 'emerald';
  }, [metrics.status]);

  return {
    metrics,
    summary,
    history,
    isConnected,
    connectionState,
    alertMessage,
    statusTone,
  };
}
