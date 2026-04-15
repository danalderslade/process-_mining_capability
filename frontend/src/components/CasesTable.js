import React, { useState, useMemo, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { fetchCaseTransitions } from '../api';

ModuleRegistry.registerModules([AllCommunityModule]);

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
            <div><span style={{ color: '#666' }}>Type:</span> {caseData.caseType}</div>
            <div><span style={{ color: '#666' }}>Country:</span> {caseData.country}</div>
            <div><span style={{ color: '#666' }}>LOB:</span> <span className={`lob-badge ${caseData.lineOfBusiness.toLowerCase()}`}>{caseData.lineOfBusiness}</span></div>
            <div><span style={{ color: '#666' }}>Status:</span> <span className={`status-badge ${statusClass(caseData.currentStatus)}`}>{STATUS_LABELS[caseData.currentStatus]}</span></div>
          </div>

          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: '#666' }}>TRANSITION HISTORY</h3>

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
  const gridRef = useRef();

  const onExportCsv = useCallback(() => {
    gridRef.current?.api?.exportDataAsCsv({ fileName: 'cases-export.csv' });
  }, []);

  const columnDefs = useMemo(() => [
    {
      headerName: 'Reference',
      field: 'caseReference',
      cellStyle: { fontWeight: 500 },
      minWidth: 140,
    },
    {
      headerName: 'Type',
      field: 'caseType',
      minWidth: 120,
    },
    {
      headerName: 'Country',
      field: 'country',
      minWidth: 120,
    },
    {
      headerName: 'LOB',
      field: 'lineOfBusiness',
      minWidth: 110,
      cellRenderer: (params) => {
        const v = params.value;
        return <span className={`lob-badge ${v.toLowerCase()}`}>{v === 'RETAIL' ? 'Retail' : 'Commercial'}</span>;
      },
    },
    {
      headerName: 'Status',
      field: 'currentStatus',
      minWidth: 160,
      cellRenderer: (params) => {
        const v = params.value;
        const cls = statusClass(v);
        const label = STATUS_LABELS[v] || v;
        return <span className={`status-badge ${cls}`}>{label}</span>;
      },
    },
    {
      headerName: 'Created',
      field: 'createdAt',
      minWidth: 160,
      valueFormatter: (params) => formatDate(params.value),
      comparator: (a, b) => new Date(a) - new Date(b),
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    flex: 1,
    minWidth: 100,
  }), []);

  const onRowClicked = useCallback((event) => {
    setSelectedCase(event.data);
  }, []);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button className="export-csv-btn" onClick={onExportCsv}>Export CSV</button>
      </div>
      <div className="ag-theme-quartz" style={{ height: 500, width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={cases}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onRowClicked={onRowClicked}
          pagination={true}
          paginationPageSize={20}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          animateRows={true}
          rowSelection="single"
          enableCellTextSelection={true}
        />
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
