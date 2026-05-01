import { cn } from '../utils/cn';

interface MetricCardProps {
  label: string;
  value: string | number;
  hint?: string;
  tone?: 'emerald' | 'amber' | 'red' | 'blue';
}

const toneClasses = {
  emerald: 'from-emerald-50 to-white text-emerald-700 border-emerald-100',
  amber: 'from-amber-50 to-white text-amber-700 border-amber-100',
  red: 'from-red-50 to-white text-red-700 border-red-100',
  blue: 'from-blue-50 to-white text-blue-700 border-blue-100',
};

export default function MetricCard({ label, value, hint, tone = 'blue' }: MetricCardProps) {
  return (
    <div className={cn('rounded-[1.5rem] border bg-gradient-to-br p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]', toneClasses[tone])}>
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <div className="mt-4 text-4xl font-bold tracking-tight text-slate-950">{value}</div>
      {hint ? <p className="mt-2 text-sm text-slate-500">{hint}</p> : null}
    </div>
  );
}
