import { motion } from 'framer-motion';
import { AlertTriangle, Radar, ShieldCheck, TimerReset } from 'lucide-react';
import AlertBanner from '../components/AlertBanner';
import BlinkRateChart from '../components/BlinkRateChart';
import LiveFeed from '../components/LiveFeed';
import MetricCard from '../components/MetricCard';
import RiskMeter from '../components/RiskMeter';
import StatusBadge from '../components/StatusBadge';
import { useDriverMonitoring } from '../hooks/useDriverMonitoring';

export default function Dashboard() {
  const { metrics, summary, history, connectionState, alertMessage } = useDriverMonitoring();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      <section className="grid gap-10 rounded-[2rem] border border-slate-100 bg-white/80 p-6 shadow-[0_12px_32px_rgba(15,23,42,0.05)] backdrop-blur-sm lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
        <div className="space-y-8">
          <div className="space-y-5">
            <p className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-600 ring-1 ring-blue-100">
              Autonomous safety watch
            </p>
            <h2 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
              Minimal driver monitoring built for immediate focus.
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
              Real-time eye state, blink rhythm, yawning, distraction, and phone use are fused into a single risk signal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(34,197,94,0.45)]" />
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">{connectionState.toUpperCase()}</span>
          </div>

          <AlertBanner message={alertMessage} />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Blink Rate" value={`${metrics.blink_rate.toFixed(0)} / min`} hint="Rolling 60-second window" tone="blue" />
            <MetricCard label="Risk Score" value={metrics.risk_score} hint="Normalized 0-100 scale" tone={metrics.risk_score > 70 ? 'red' : metrics.risk_score > 35 ? 'amber' : 'emerald'} />
            <MetricCard label="EAR" value={metrics.ear.toFixed(3)} hint="Eye aspect ratio" tone="blue" />
            <MetricCard label="Status" value={metrics.status} hint="Driver condition" tone={metrics.status === 'DANGER' ? 'red' : metrics.status === 'WARNING' ? 'amber' : 'emerald'} />
          </div>

          <div className="rounded-[1.75rem] border border-slate-100 bg-gradient-to-br from-white to-blue-50/40 p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.45em] text-blue-600/70">Driver state</p>
                <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">What the system sees</h3>
              </div>
              <StatusBadge status={metrics.status} />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-slate-500"><ShieldCheck className="h-4 w-4 text-emerald-500" />Eyes closed</div>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{metrics.eyes_closed ? 'Yes' : 'No'}</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-slate-500"><AlertTriangle className="h-4 w-4 text-amber-500" />Yawning</div>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{metrics.yawning ? 'Detected' : 'Clear'}</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-slate-500"><Radar className="h-4 w-4 text-blue-500" />Looking away</div>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{metrics.looking_away ? 'Yes' : 'No'}</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-slate-500"><TimerReset className="h-4 w-4 text-slate-500" />Phone detected</div>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{metrics.phone_detected ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <RiskMeter score={metrics.risk_score} />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-6">
          <BlinkRateChart data={history} />
          <LiveFeed />

          <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <p className="text-xs uppercase tracking-[0.45em] text-blue-600/70">AI Insights</p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Behavior summary</h3>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              {(metrics.insights ?? []).length > 0 ? metrics.insights!.map((insight) => (
                <motion.div key={insight} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="rounded-[1.25rem] border border-slate-100 bg-blue-50/50 px-4 py-3">
                  {insight}
                </motion.div>
              )) : (
                <p>No insights yet. Start the camera stream to build a risk timeline.</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <p className="text-xs uppercase tracking-[0.45em] text-blue-600/70">Session Summary</p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Driver behavior snapshot</h3>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <p>Samples: {summary?.samples ?? 0}</p>
              <p>Average risk: {summary?.average_risk_score?.toFixed?.(2) ?? '0.00'}</p>
              <p>Danger rate: {(Number(summary?.danger_rate ?? 0) * 100).toFixed(1)}%</p>
              <p>Warning rate: {(Number(summary?.warning_rate ?? 0) * 100).toFixed(1)}%</p>
              <p className="rounded-[1.25rem] border border-slate-100 bg-slate-50 px-4 py-3 text-slate-700">{summary?.insight ?? 'No session summary available yet.'}</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <p className="text-xs uppercase tracking-[0.45em] text-blue-600/70">System notes</p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Driver safety snapshot</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              The dashboard fuses webcam telemetry, risk history, and AI insights into a clean operator view that stays readable under pressure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
