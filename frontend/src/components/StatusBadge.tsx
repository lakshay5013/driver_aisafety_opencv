import { cn } from '../utils/cn';

interface StatusBadgeProps {
  status: 'SAFE' | 'WARNING' | 'DANGER';
}

const toneMap = {
  SAFE: 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm',
  WARNING: 'bg-amber-50 text-amber-700 border-amber-100 shadow-sm',
  DANGER: 'bg-red-50 text-red-700 border-red-100 shadow-sm',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.18em]', toneMap[status])}>
      {status}
    </span>
  );
}
