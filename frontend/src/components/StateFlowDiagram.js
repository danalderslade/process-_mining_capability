import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';

const STATUS_POSITIONS = {
  NEW: { x: 50, y: 200 },
  UNDER_INVESTIGATION: { x: 300, y: 200 },
  AWAITING_INFORMATION: { x: 300, y: 400 },
  REVIEW: { x: 600, y: 200 },
  CLOSED: { x: 850, y: 200 },
};

const STATUS_COLORS = {
  NEW: { bg: '#1e3a5f', border: '#60a5fa', text: '#93c5fd' },
  UNDER_INVESTIGATION: { bg: '#422006', border: '#f59e0b', text: '#fcd34d' },
  AWAITING_INFORMATION: { bg: '#431407', border: '#f97316', text: '#fdba74' },
  REVIEW: { bg: '#2e1065', border: '#a78bfa', text: '#c4b5fd' },
  CLOSED: { bg: '#064e3b', border: '#34d399', text: '#6ee7b7' },
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

const StateFlowDiagram = ({ processFlow }) => {
  const { nodes, edges } = useMemo(() => {
    if (!processFlow) return { nodes: [], edges: [] };

    const edgeMap = {};
    (processFlow.edges || []).forEach(e => {
      edgeMap[`${e.from}-${e.to}`] = e;
    });

    const flowNodes = processFlow.statuses.map((status) => {
      const colors = STATUS_COLORS[status] || { bg: '#1e293b', border: '#475569', text: '#e2e8f0' };
      const pos = STATUS_POSITIONS[status] || { x: 0, y: 0 };

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
            </div>
          ),
        },
        style: {
          background: colors.bg,
          border: `2px solid ${colors.border}`,
          borderRadius: 10,
          width: 140,
          minHeight: 60,
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

      const label = count > 0
        ? `${count} cases\n${formatHours(avgHours)} avg`
        : '0 cases';

      return {
        id: `${from}-${to}`,
        source: from,
        target: to,
        type: isBackLoop ? 'default' : 'default',
        label,
        labelStyle: {
          fontSize: 10,
          fontWeight: 500,
          fill: '#94a3b8',
          whiteSpace: 'pre-line',
        },
        labelBgStyle: {
          fill: '#0f172a',
          fillOpacity: 0.9,
        },
        labelBgPadding: [6, 4],
        labelBgBorderRadius: 4,
        style: {
          stroke: count > 0 ? '#475569' : '#1e293b',
          strokeWidth: Math.max(1, Math.min(4, count / 10)),
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: count > 0 ? '#475569' : '#1e293b',
        },
        animated: count > 0,
        sourceHandle: isBackLoop ? 'bottom' : undefined,
        targetHandle: isBackLoop ? 'bottom' : undefined,
      };
    });

    return { nodes: flowNodes, edges: flowEdges };
  }, [processFlow]);

  return (
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
        <Background color="#1e293b" gap={20} />
        <Controls
          showInteractive={false}
          style={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: 8,
          }}
        />
      </ReactFlow>
    </div>
  );
};

export default StateFlowDiagram;
