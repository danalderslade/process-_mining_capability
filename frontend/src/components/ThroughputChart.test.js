import React from 'react';
import { render, screen } from '@testing-library/react';
import ThroughputChart from './ThroughputChart';

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  };
});

describe('ThroughputChart', () => {
  const metrics = [
    { fromStatus: 'NEW', toStatus: 'UNDER_INVESTIGATION', count: 50, avgHours: 12.5 },
    { fromStatus: 'UNDER_INVESTIGATION', toStatus: 'REVIEW', count: 40, avgHours: 168.0 },
  ];

  it('renders the bar chart', () => {
    render(<ThroughputChart metrics={metrics} />);

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('shows no data message when metrics are empty', () => {
    render(<ThroughputChart metrics={[]} />);

    expect(screen.getByText(/No throughput data available/)).toBeInTheDocument();
  });

  it('shows no data message when metrics are null', () => {
    render(<ThroughputChart metrics={null} />);

    expect(screen.getByText(/No throughput data available/)).toBeInTheDocument();
  });
});
