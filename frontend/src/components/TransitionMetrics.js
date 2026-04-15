import React from 'react';

const STATUS_LABELS = {
  NEW: 'New',
  UNDER_INVESTIGATION: 'Under Investigation',
  AWAITING_INFORMATION: 'Awaiting Information',
  REVIEW: 'Review',
  CLOSED: 'Closed',
};

const formatHours = (hours) => {
  if (hours == null) return '—';
  if (hours < 24) return `${hours.toFixed(1)}h`;
  const days = hours / 24;
  return `${days.toFixed(1)}d`;
};

const getHoursClass = (hours) => {
  if (hours == null) return '';
  if (hours < 48) return 'hours-fast';
  if (hours < 168) return 'hours-medium';
  return 'hours-slow';
};

const TransitionMetrics = ({ metrics }) => {
  if (!metrics || metrics.length === 0) {
    return <div className="loading">No transition data available</div>;
  }

  return (
    <table className="transition-table">
      <thead>
        <tr>
          <th>From</th>
          <th>To</th>
          <th>Count</th>
          <th>Avg Duration</th>
        </tr>
      </thead>
      <tbody>
        {metrics.map((m, i) => (
          <tr key={i}>
            <td>{STATUS_LABELS[m.fromStatus] || m.fromStatus}</td>
            <td>{STATUS_LABELS[m.toStatus] || m.toStatus}</td>
            <td>{m.count}</td>
            <td className={`avg-hours ${getHoursClass(m.avgHours)}`}>
              {formatHours(m.avgHours)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransitionMetrics;
