import React, { useState } from 'react';
import { fetchCaseTransitions } from '../api';

const STATUS_LABELS = {
  NEW: 'New',
  UNDER_INVESTIGATION: 'Under Investigation',
  AWAITING_INFORMATION: 'Awaiting Information',
  REVIEW: 'Review',
  CLOSED: 'Closed',
};

const statusClass = (status) => {
  return status.toLowerCase().replace(/_/g, '-');
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const CaseDetailModal = ({ caseData, onClose }) => {
  const [transitions, setTransitions] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchCaseTransitions(caseData.id)
      .then(setTransitions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [caseData.id]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{caseData.caseReference}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div style={{ marginBottom: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
            <div><span style={{ color: '#94a3b8' }}>Type:</span> {caseData.caseType}</div>
            <div><span style={{ color: '#94a3b8' }}>Country:</span> {caseData.country}</div>
            <div><span style={{ color: '#94a3b8' }}>LOB:</span> <span className={`lob-badge ${caseData.lineOfBusiness.toLowerCase()}`}>{caseData.lineOfBusiness}</span></div>
            <div><span style={{ color: '#94a3b8' }}>Status:</span> <span className={`status-badge ${statusClass(caseData.currentStatus)}`}>{STATUS_LABELS[caseData.currentStatus]}</span></div>
          </div>

          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: '#94a3b8' }}>TRANSITION HISTORY</h3>

          {loading ? (
            <div className="loading"><div className="loading-spinner" />Loading...</div>
          ) : (
            <div className="timeline">
              {transitions && transitions.map((t, i) => (
                <div key={i} className="timeline-item">
                  <div className="time">{formatDate(t.transitionedAt)}</div>
                  <div className="transition-label">
                    {t.fromStatus
                      ? `${STATUS_LABELS[t.fromStatus]} → ${STATUS_LABELS[t.toStatus]}`
                      : `Created as ${STATUS_LABELS[t.toStatus]}`
                    }
                  </div>
                  <div className="by">{t.transitionedBy}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CasesTable = ({ cases }) => {
  const [selectedCase, setSelectedCase] = useState(null);

  return (
    <>
      <div className="cases-scroll">
        <table className="cases-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Type</th>
              <th>Country</th>
              <th>LOB</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {cases.map(c => (
              <tr key={c.id} onClick={() => setSelectedCase(c)}>
                <td style={{ fontWeight: 500 }}>{c.caseReference}</td>
                <td>{c.caseType}</td>
                <td>{c.country}</td>
                <td>
                  <span className={`lob-badge ${c.lineOfBusiness.toLowerCase()}`}>
                    {c.lineOfBusiness === 'RETAIL' ? 'Retail' : 'Commercial'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${statusClass(c.currentStatus)}`}>
                    {STATUS_LABELS[c.currentStatus] || c.currentStatus}
                  </span>
                </td>
                <td style={{ color: '#94a3b8', fontSize: 12 }}>{formatDate(c.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCase && (
        <CaseDetailModal
          caseData={selectedCase}
          onClose={() => setSelectedCase(null)}
        />
      )}
    </>
  );
};

export default CasesTable;
