import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const STATUS_LABELS = {
  NEW: 'New',
  UNDER_INVESTIGATION: 'Under Inv.',
  AWAITING_INFORMATION: 'Awaiting Info',
  REVIEW: 'Review',
  CLOSED: 'Closed',
};

const COLORS = {
  'NEW→UNDER_INVESTIGATION': '#60a5fa',
  'UNDER_INVESTIGATION→AWAITING_INFORMATION': '#f59e0b',
  'AWAITING_INFORMATION→UNDER_INVESTIGATION': '#f97316',
  'UNDER_INVESTIGATION→REVIEW': '#a78bfa',
  'REVIEW→CLOSED': '#34d399',
};

const ThroughputChart = ({ metrics }) => {
  if (!metrics || metrics.length === 0) {
    return <div className="loading">No throughput data available</div>;
  }

  const data = metrics.map(m => ({
    name: `${STATUS_LABELS[m.fromStatus] || m.fromStatus} → ${STATUS_LABELS[m.toStatus] || m.toStatus}`,
    hours: m.avgHours ? Math.round(m.avgHours * 10) / 10 : 0,
    key: `${m.fromStatus}→${m.toStatus}`,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: 6,
          padding: '8px 12px',
          fontSize: 12,
          color: '#e2e8f0'
        }}>
          <div style={{ fontWeight: 600 }}>{d.name}</div>
          <div style={{ color: '#94a3b8', marginTop: 2 }}>
            Avg: {d.hours < 24 ? `${d.hours}h` : `${(d.hours / 24).toFixed(1)}d`}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: '#94a3b8' }}
          angle={-30}
          textAnchor="end"
          height={80}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 11 } }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[entry.key] || '#3b82f6'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ThroughputChart;
