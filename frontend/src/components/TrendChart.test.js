import React from 'react';
import { render, screen } from '@testing-library/react';
import TrendChart from './TrendChart';

// Mock recharts to avoid canvas-related errors in jsdom
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  };
});

describe('TrendChart', () => {
  const trendData = [
    { month: '2025-03', avgHours: 432, count: 10 },
    { month: '2025-04', avgHours: 360, count: 12 },
    { month: '2025-05', avgHours: 288, count: 15 },
    { month: '2025-06', avgHours: 72, count: 18 },
  ];

  it('renders the chart with data', () => {
    render(<TrendChart trend={trendData} />);

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('shows improvement percentage badge', () => {
    render(<TrendChart trend={trendData} />);

    // 432h -> 72h = 83% improvement
    expect(screen.getByText(/83% faster/)).toBeInTheDocument();
  });

  it('shows from/to summary in days', () => {
    render(<TrendChart trend={trendData} />);

    expect(screen.getByText(/18\.0d.*3\.0d.*avg investigation time/)).toBeInTheDocument();
  });

  it('shows no data message when trend is empty', () => {
    render(<TrendChart trend={[]} />);

    expect(screen.getByText(/No trend data available/)).toBeInTheDocument();
  });

  it('shows no data message when trend is null', () => {
    render(<TrendChart trend={null} />);

    expect(screen.getByText(/No trend data available/)).toBeInTheDocument();
  });
});
