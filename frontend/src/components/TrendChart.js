import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const MONTH_LABELS = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
  '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
  '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec',
};

const formatMonth = (yyyyMM) => {
  const [year, month] = yyyyMM.split('-');
  return `${MONTH_LABELS[month] || month} ${year}`;
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div style={{
        background: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: 6,
        padding: '10px 14px',
        fontSize: 12,
        color: '#333333',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>{d.monthLabel}</div>
        <div>Avg: <strong>{d.days < 1 ? `${(d.days * 24).toFixed(1)}h` : `${d.days.toFixed(1)} days`}</strong></div>
        <div style={{ color: '#666', marginTop: 2 }}>{d.cases} cases</div>
      </div>
    );
  }
  return null;
};

const TrendChart = ({ trend }) => {
  if (!trend || trend.length === 0) {
    return <div className="loading">No trend data available</div>;
  }

  const data = trend.map(t => ({
    month: t.month,
    monthLabel: formatMonth(t.month),
    days: Math.round(t.avgHours / 24 * 10) / 10,
    hours: Math.round(t.avgHours * 10) / 10,
    cases: t.count,
  }));

  const firstVal = data[0].days;
  const lastVal = data[data.length - 1].days;
  const improvement = firstVal > 0 ? Math.round((1 - lastVal / firstVal) * 100) : 0;

  return (
    <div>
      <div className="trend-summary">
        <span className="trend-badge improvement">
          ↓ {improvement}% faster
        </span>
        <span className="trend-detail">
          {firstVal.toFixed(1)}d → {lastVal.toFixed(1)}d avg investigation time
        </span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="monthLabel"
            tick={{ fontSize: 11, fill: '#666666' }}
            tickLine={{ stroke: '#e0e0e0' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#666666' }}
            label={{ value: 'Days', angle: -90, position: 'insideLeft', style: { fill: '#666666', fontSize: 11 } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="days"
            stroke="#DB0011"
            strokeWidth={2.5}
            dot={{ fill: '#DB0011', r: 4, strokeWidth: 2, stroke: '#ffffff' }}
            activeDot={{ r: 6, fill: '#DB0011', stroke: '#ffffff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
