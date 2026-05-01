import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChartNoAxesCombined, Gauge, LayoutDashboard, Radar } from 'lucide-react';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import LiveMonitoring from './pages/LiveMonitoring';
import Analytics from './pages/Analytics';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Live Monitoring', path: '/live', icon: Radar },
  { label: 'Analytics', path: '/analytics', icon: ChartNoAxesCombined },
];

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we're on the landing page
  const isLandingPage = location.pathname === '/';

  if (isLandingPage) {
    return <Landing />;
  }

  return (
    <div className="min-h-screen bg-[#f7f9ff] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1550px] flex-col px-4 py-4 md:px-6 md:py-6">
        <header className="sticky top-4 z-40 rounded-[1.75rem] border border-slate-200/70 bg-white/85 px-5 py-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur-md md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 text-center lg:text-left"
              aria-label="Go to landing page"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-white shadow-sm">
                <Gauge className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.45em] text-blue-600/70">DriveSafe</p>
                <h1 className="mt-1 text-lg font-semibold tracking-tight text-slate-950 md:text-xl">AI driver monitoring dashboard</h1>
              </div>
            </button>

            <nav className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-slate-200 bg-white p-2 shadow-sm">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                      active
                        ? 'bg-blue-600 text-white shadow-[0_10px_24px_rgba(59,130,246,0.24)]'
                        : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                    aria-label={item.label}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(34,197,94,0.45)]" />
              Live mode
            </div>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center py-6 md:py-8">
          <AnimatePresence mode="wait">
            <motion.section
              key={location.pathname}
              initial={{ opacity: 0, y: 18, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full"
            >
              <Routes location={location}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/live" element={<LiveMonitoring />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.section>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
