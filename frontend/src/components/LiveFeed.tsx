import { useState } from 'react';
import { Play, Square } from 'lucide-react';
import { api, videoFeedUrl } from '../lib/api';

export default function LiveFeed() {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleCamera = async () => {
    setLoading(true);
    try {
      if (isActive) {
        await api.post('/stop-camera');
        setIsActive(false);
      } else {
        await api.post('/start-camera');
        setIsActive(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.45em] text-blue-600/70">Live Webcam</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Driver cabin view</h3>
        </div>
        <button
          onClick={toggleCamera}
          disabled={loading}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
            isActive ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
          } disabled:opacity-60`}
        >
          {isActive ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {loading ? 'Working...' : isActive ? 'Stop Camera' : 'Start Camera'}
        </button>
      </div>
      <div className="relative min-h-[440px] flex-1 bg-slate-100">
        {isActive ? (
          <img src={videoFeedUrl} alt="Live driver monitoring feed" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full min-h-[440px] flex-col items-center justify-center px-6 text-center text-slate-500">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-blue-100 bg-white shadow-[0_0_40px_rgba(79,115,242,0.12)]">
              <Play className="h-9 w-9 text-blue-600" />
            </div>
            <p className="text-2xl font-semibold text-slate-950">Camera feed is paused</p>
            <p className="mt-2 max-w-md text-sm leading-6">
              Start the camera to stream the driver view, run real-time detection, and push metrics into the dashboard.
            </p>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.6)_100%)]" />
      </div>
    </div>
  );
}
