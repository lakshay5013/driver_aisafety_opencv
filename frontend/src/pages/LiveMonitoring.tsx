import { motion } from 'framer-motion';
import { Video, Wifi } from 'lucide-react';
import AlertBanner from '../components/AlertBanner';
import LiveFeed from '../components/LiveFeed';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import { useDriverMonitoring } from '../hooks/useDriverMonitoring';

export default function LiveMonitoring() {
  const { metrics, alertMessage, connectionState, isConnected } = useDriverMonitoring();

  return (
    <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <div className="flex flex-col gap-6">
        <AlertBanner message={alertMessage} />
        <LiveFeed />
      </div>

      <div className="flex flex-col gap-6">
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-blue-600/70">Live Session</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Telemetry stream</h2>
            </div>
            <StatusBadge status={metrics.status} />
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <MetricCard label="Risk Score" value={metrics.risk_score} tone={metrics.risk_score > 70 ? 'red' : metrics.risk_score > 35 ? 'amber' : 'emerald'} />
            <MetricCard label="Blink Rate" value={`${metrics.blink_rate.toFixed(0)} / min`} tone="blue" />
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-3 text-slate-700">
            <Wifi className={`h-5 w-5 ${isConnected ? 'text-emerald-500' : 'text-red-500'}`} />
            <div>
              <p className="text-sm uppercase tracking-[0.45em] text-blue-600/70">Connection State</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{connectionState}</p>
            </div>
          </div>
          <div className="mt-5 rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
            <Video className="mb-3 h-5 w-5 text-blue-600" />
            The video element streams the backend MJPEG output and updates in sync with the WebSocket telemetry feed.
          </div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-[1.5rem] border border-slate-100 bg-blue-50/60 p-4 text-sm text-slate-600"
          >
            Current status: <span className="font-semibold text-slate-950">{metrics.status}</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
