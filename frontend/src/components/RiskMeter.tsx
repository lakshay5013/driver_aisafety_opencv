import { motion } from 'framer-motion';

interface RiskMeterProps {
  score: number;
}

export default function RiskMeter({ score }: RiskMeterProps) {
  const safeScore = Math.max(0, Math.min(100, score));
  const circumference = 2 * Math.PI * 76;
  const dashOffset = circumference - (safeScore / 100) * circumference;
  const color = safeScore > 70 ? '#ef4444' : safeScore > 35 ? '#f59e0b' : '#2563eb';

  return (
    <div className="relative flex min-h-[520px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.16),transparent_42%)]" />
      <svg viewBox="0 0 200 200" className="h-64 w-64 -rotate-90 drop-shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
        <circle cx="100" cy="100" r="76" fill="none" stroke="#e5eefb" strokeWidth="18" />
        <motion.circle
          cx="100"
          cy="100"
          r="76"
          fill="none"
          stroke={color}
          strokeWidth="18"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ filter: 'drop-shadow(0 0 12px rgba(37,99,235,0.16))' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Risk Score</p>
        <motion.div
          key={safeScore}
          initial={{ scale: 0.95, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-2 text-7xl font-bold tracking-tight text-slate-950"
        >
          {safeScore}
        </motion.div>
        <p className="mt-3 text-sm uppercase tracking-[0.45em] text-slate-500">0 safe / 100 critical</p>
      </div>
    </div>
  );
}
