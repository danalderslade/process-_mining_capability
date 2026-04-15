import React, { useMemo, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

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
  const gridRef = useRef();

  const onExportCsv = useCallback(() => {
    gridRef.current?.api?.exportDataAsCsv({ fileName: 'transition-metrics-export.csv' });
  }, []);

  const rowData = useMemo(() => {
    if (!metrics) return [];
    return metrics.map(m => ({
      from: STATUS_LABELS[m.fromStatus] || m.fromStatus,
      to: STATUS_LABELS[m.toStatus] || m.toStatus,
      count: m.count,
      avgHours: m.avgHours,
      avgFormatted: formatHours(m.avgHours),
    }));
  }, [metrics]);

  const columnDefs = useMemo(() => [
    { headerName: 'From', field: 'from', minWidth: 140 },
    { headerName: 'To', field: 'to', minWidth: 140 },
    { headerName: 'Count', field: 'count', minWidth: 90, type: 'numericColumn' },
    {
      headerName: 'Avg Duration',
      field: 'avgHours',
      minWidth: 130,
      type: 'numericColumn',
      valueFormatter: (params) => formatHours(params.value),
      cellClass: (params) => `avg-hours ${getHoursClass(params.value)}`,
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    flex: 1,
    minWidth: 80,
  }), []);

  if (!metrics || metrics.length === 0) {
    return <div className="loading">No transition data available</div>;
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button className="export-csv-btn" onClick={onExportCsv}>Export CSV</button>
      </div>
      <div className="ag-theme-quartz" style={{ height: 300, width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows={true}
        enableCellTextSelection={true}
      />
    </div>
    </>
  );
};

export default TransitionMetrics;
