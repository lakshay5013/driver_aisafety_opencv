import { ResponsiveContainer, Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

interface BlinkRateChartProps {
  data: number[];
}

export default function BlinkRateChart({ data }: BlinkRateChartProps) {
  const chartData = data.map((value, index) => ({
    sample: index + 1,
    risk: value,
  }));

  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.35em] text-blue-600/70">Risk Trend</p>
        <h3 className="mt-2 text-xl font-bold text-slate-950">Live risk score movement</h3>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#4f73f2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e8effa" strokeDasharray="4 6" />
            <XAxis dataKey="sample" stroke="#94a3b8" tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.96)',
                border: '1px solid rgba(226, 232, 240, 1)',
                borderRadius: 18,
                color: '#0f172a',
              }}
            />
            <Area type="monotone" dataKey="risk" stroke="#3b82f6" fill="url(#riskGradient)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
