import { motion } from 'framer-motion';
import { Brain, ChartSpline, DatabaseZap, ShieldAlert } from 'lucide-react';
import BlinkRateChart from '../components/BlinkRateChart';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import { useDriverMonitoring } from '../hooks/useDriverMonitoring';

export default function Analytics() {
  const { metrics, summary, history } = useDriverMonitoring();

  return (
    <div className="mx-auto grid max-w-7xl gap-6 overflow-y-auto pb-2 scrollbar-none xl:grid-cols-[0.9fr_1.1fr]">
      <div className="flex flex-col gap-6">
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-blue-600/70">Analytics</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Driver risk intelligence</h2>
            </div>
            <StatusBadge status={metrics.status} />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <MetricCard label="Samples" value={summary?.samples ?? 0} tone="blue" />
            <MetricCard label="Avg Risk" value={summary?.average_risk_score?.toFixed?.(2) ?? '0.00'} tone={metrics.risk_score > 70 ? 'red' : 'amber'} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-3">
            <DatabaseZap className="h-5 w-5 text-blue-600" />
            <h3 className="text-2xl font-bold text-slate-950">Session intelligence</h3>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            The backend stores session snapshots in SQLite and surfaces summary analytics through <span className="font-semibold text-slate-950">/session-summary</span>.
          </p>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <div className="rounded-[1.25rem] border border-slate-100 bg-slate-50 px-4 py-3">Danger rate: {(Number(summary?.danger_rate ?? 0) * 100).toFixed(1)}%</div>
            <div className="rounded-[1.25rem] border border-slate-100 bg-slate-50 px-4 py-3">Warning rate: {(Number(summary?.warning_rate ?? 0) * 100).toFixed(1)}%</div>
            <div className="rounded-[1.25rem] border border-slate-100 bg-slate-50 px-4 py-3">Distraction rate: {(Number(summary?.distraction_rate ?? 0) * 100).toFixed(1)}%</div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            <h3 className="text-2xl font-bold text-slate-950">AI safety scorecards</h3>
          </div>
          <motion.div className="mt-5 space-y-3 text-sm text-slate-600">
            {(metrics.insights ?? []).length > 0 ? metrics.insights!.map((insight) => (
              <motion.div key={insight} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.25rem] border border-slate-100 bg-blue-50/50 px-4 py-3">
                {insight}
              </motion.div>
            )) : (
              <p>No AI insights yet. Build up a session to surface patterns.</p>
            )}
          </motion.div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <BlinkRateChart data={history} />
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-3">
            <Brain className="h-5 w-5 text-blue-600" />
            <h3 className="text-2xl font-bold text-slate-950">Narrative summary</h3>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            {summary?.insight ?? 'No session summary available yet. Start monitoring to generate behavioral analytics and distraction insights.'}
          </p>
          <div className="mt-6 rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
            The dashboard can voice alerts when risk crosses the warning threshold and uses the live history trend to help operators spot spikes.
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-3">
            <ChartSpline className="h-5 w-5 text-blue-600" />
            <h3 className="text-2xl font-bold text-slate-950">Operational notes</h3>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>• Use the backend WebSocket for real-time telemetry.</li>
            <li>• Keep the YOLO weights in backend/models/best.pt.</li>
            <li>• Tune EAR and MAR thresholds with your dataset.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
