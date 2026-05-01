import { AnimatePresence, motion } from 'framer-motion';
import { TriangleAlert } from 'lucide-react';

interface AlertBannerProps {
  message: string | null;
}

export default function AlertBanner({ message }: AlertBannerProps) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-3 rounded-[1.5rem] border border-red-100 bg-red-50 px-4 py-3 text-red-700 shadow-sm"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <TriangleAlert className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.36em] text-red-600/70">Live Alert</p>
            <p className="text-sm text-red-700">{message}</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
