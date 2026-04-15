import React from 'react';

const STATUS_CONFIG = {
  NEW: { label: 'New', className: 'new' },
  UNDER_INVESTIGATION: { label: 'Under Investigation', className: 'under-investigation' },
  AWAITING_INFORMATION: { label: 'Awaiting Info', className: 'awaiting-information' },
  REVIEW: { label: 'Review', className: 'review' },
  CLOSED: { label: 'Closed', className: 'closed' },
};

const StatusSummary = ({ statusCounts }) => {
  const allStatuses = ['NEW', 'UNDER_INVESTIGATION', 'AWAITING_INFORMATION', 'REVIEW', 'CLOSED'];

  return (
    <div className="status-summary">
      {allStatuses.map(status => {
        const found = statusCounts.find(sc => sc.status === status);
        const count = found ? found.count : 0;
        const config = STATUS_CONFIG[status];

        return (
          <div key={status} className={`status-card ${config.className}`}>
            <div className="count">{count}</div>
            <div className="label">{config.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusSummary;
