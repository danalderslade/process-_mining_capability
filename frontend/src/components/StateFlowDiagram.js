import React, { useState, useMemo } from 'react';
import ReactFlow, { Background, Controls, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';

const STATUS_POSITIONS = {
  NEW: { x: 250, y: 0 },
  UNDER_INVESTIGATION: { x: 250, y: 140 },
  AWAITING_INFORMATION: { x: 500, y: 140 },
  REVIEW: { x: 250, y: 280 },
  CLOSED: { x: 250, y: 420 },
};

const STATUS_COLORS = {
  NEW: { bg: '#E8F4FD', border: '#0072AA', text: '#0072AA' },
  UNDER_INVESTIGATION: { bg: '#FDEEED', border: '#DB0011', text: '#DB0011' },
  AWAITING_INFORMATION: { bg: '#FDF2E9', border: '#D35400', text: '#D35400' },
  REVIEW: { bg: '#F4ECF7', border: '#8E44AD', text: '#8E44AD' },
  CLOSED: { bg: '#E8F8F0', border: '#27AE60', text: '#27AE60' },
};

const STATUS_LABELS = {
  NEW: 'New',
  UNDER_INVESTIGATION: 'Under\nInvestigation',
  AWAITING_INFORMATION: 'Awaiting\nInformation',
  REVIEW: 'Review',
  CLOSED: 'Closed',
};

const formatHours = (hours) => {
  if (hours == null) return '';
  if (hours < 24) return `${hours.toFixed(1)}h`;
  const days = hours / 24;
  return `${days.toFixed(1)}d`;
};

const computeDwellTimes = (edges) => {
  const dwellMap = {};
  if (!edges) return dwellMap;

  // Group outgoing edges by source state
  const outgoing = {};
  edges.forEach(e => {
    if (!outgoing[e.from]) outgoing[e.from] = [];
    outgoing[e.from].push(e);
  });

  // For each state, compute weighted avg dwell time from outgoing edges
  Object.entries(outgoing).forEach(([status, outs]) => {
    let totalWeightedHours = 0;
    let totalCount = 0;
    outs.forEach(e => {
      if (e.avgHours != null && e.count > 0) {
        totalWeightedHours += e.avgHours * e.count;
        totalCount += e.count;
      }
    });
    if (totalCount > 0) {
      dwellMap[status] = totalWeightedHours / totalCount;
    }
  });

  return dwellMap;
};

const StateFlowDiagram = ({ processFlow }) => {
  const [viewMode, setViewMode] = useState('throughput');

  const { nodes, edges } = useMemo(() => {
    if (!processFlow) return { nodes: [], edges: [] };

    const edgeMap = {};
    (processFlow.edges || []).forEach(e => {
      edgeMap[`${e.from}-${e.to}`] = e;
    });

    const dwellTimes = viewMode === 'dwell' ? computeDwellTimes(processFlow.edges) : {};

    const flowNodes = processFlow.statuses.map((status) => {
      const colors = STATUS_COLORS[status] || { bg: '#1e293b', border: '#475569', text: '#e2e8f0' };
      const pos = STATUS_POSITIONS[status] || { x: 0, y: 0 };
      const dwellTime = dwellTimes[status];

      return {
        id: status,
        position: pos,
        data: {
          label: (
            <div style={{
              textAlign: 'center',
              padding: '8px 4px',
              lineHeight: 1.3,
            }}>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: colors.text,
                whiteSpace: 'pre-line',
              }}>
                {STATUS_LABELS[status] || status}
              </div>
              {viewMode === 'dwell' && (
                <div style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#333333',
                  marginTop: 4,
                  background: 'rgba(0,0,0,0.06)',
                  borderRadius: 3,
                  padding: '2px 6px',
                }}>
                  {dwellTime != null ? `Avg ${formatHours(dwellTime)}` : 'N/A'}
                </div>
              )}
            </div>
          ),
        },
        style: {
          background: colors.bg,
          border: `2px solid ${colors.border}`,
          borderRadius: 10,
          width: 140,
          minHeight: viewMode === 'dwell' ? 70 : 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      };
    });

    const validTransitions = [
      { from: 'NEW', to: 'UNDER_INVESTIGATION' },
      { from: 'UNDER_INVESTIGATION', to: 'AWAITING_INFORMATION' },
      { from: 'AWAITING_INFORMATION', to: 'UNDER_INVESTIGATION' },
      { from: 'UNDER_INVESTIGATION', to: 'REVIEW' },
      { from: 'REVIEW', to: 'CLOSED' },
    ];

    const flowEdges = validTransitions.map(({ from, to }) => {
      const edgeData = edgeMap[`${from}-${to}`];
      const count = edgeData ? edgeData.count : 0;
      const avgHours = edgeData ? edgeData.avgHours : null;
      const isBackLoop = from === 'AWAITING_INFORMATION' && to === 'UNDER_INVESTIGATION';

      let label;
      if (viewMode === 'throughput') {
        label = count > 0
          ? `${count} cases\n${formatHours(avgHours)} avg`
          : '0 cases';
      } else {
        label = count > 0 ? `${count}` : '0';
      }

      return {
        id: `${from}-${to}`,
        source: from,
        target: to,
        type: isBackLoop ? 'default' : 'default',
        label,
        labelStyle: {
          fontSize: 10,
          fontWeight: 500,
          fill: '#666666',
          whiteSpace: 'pre-line',
        },
        labelBgStyle: {
          fill: '#ffffff',
          fillOpacity: 0.95,
        },
        labelBgPadding: [6, 4],
        labelBgBorderRadius: 4,
        style: {
          stroke: count > 0 ? '#999999' : '#e0e0e0',
          strokeWidth: Math.max(1, Math.min(4, count / 10)),
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: count > 0 ? '#999999' : '#e0e0e0',
        },
        animated: count > 0,
        sourceHandle: isBackLoop ? 'right' : undefined,
        targetHandle: isBackLoop ? 'right' : undefined,
      };
    });

    return { nodes: flowNodes, edges: flowEdges };
  }, [processFlow, viewMode]);

  return (
    <div>
      <div className="flow-toggle">
        <button
          className={`flow-toggle-btn ${viewMode === 'throughput' ? 'active' : ''}`}
          onClick={() => setViewMode('throughput')}
        >
          Case Throughput
        </button>
        <button
          className={`flow-toggle-btn ${viewMode === 'dwell' ? 'active' : ''}`}
          onClick={() => setViewMode('dwell')}
        >
          Time in State
        </button>
      </div>
      <div className="state-flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#e0e0e0" gap={20} />
          <Controls
            showInteractive={false}
            style={{
              background: '#ffffff',
              border: '1px solid #e0e0e0',
              borderRadius: 6,
            }}
          />
        </ReactFlow>
      </div>
    </div>
  );
};

export default StateFlowDiagram;
