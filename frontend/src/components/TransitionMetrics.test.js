import React from 'react';
import { render, screen } from '@testing-library/react';
import TransitionMetrics from './TransitionMetrics';

// Mock AG Grid to avoid complex DOM setup
jest.mock('ag-grid-react', () => ({
  AgGridReact: (props) => (
    <div data-testid="ag-grid">
      {props.rowData && props.rowData.map((row, i) => (
        <div key={i} data-testid={`row-${i}`}>
          {row.from} → {row.to}: {row.count} ({row.avgFormatted})
        </div>
      ))}
    </div>
  ),
}));

jest.mock('ag-grid-community', () => ({
  AllCommunityModule: {},
  ModuleRegistry: { registerModules: jest.fn() },
}));

describe('TransitionMetrics', () => {
  const metrics = [
    { fromStatus: 'NEW', toStatus: 'UNDER_INVESTIGATION', count: 50, avgHours: 12.5 },
    { fromStatus: 'UNDER_INVESTIGATION', toStatus: 'REVIEW', count: 40, avgHours: 168.0 },
  ];

  it('renders the grid with data', () => {
    render(<TransitionMetrics metrics={metrics} />);

    expect(screen.getByTestId('ag-grid')).toBeInTheDocument();
    expect(screen.getByTestId('row-0')).toHaveTextContent('New → Under Investigation');
    expect(screen.getByTestId('row-1')).toHaveTextContent('Under Investigation → Review');
  });

  it('formats hours correctly - under 24h', () => {
    render(<TransitionMetrics metrics={[{ fromStatus: 'NEW', toStatus: 'UNDER_INVESTIGATION', count: 10, avgHours: 12.5 }]} />);

    expect(screen.getByTestId('row-0')).toHaveTextContent('12.5h');
  });

  it('formats hours correctly - over 24h shows days', () => {
    render(<TransitionMetrics metrics={[{ fromStatus: 'NEW', toStatus: 'UNDER_INVESTIGATION', count: 10, avgHours: 168.0 }]} />);

    expect(screen.getByTestId('row-0')).toHaveTextContent('7.0d');
  });

  it('shows export CSV button', () => {
    render(<TransitionMetrics metrics={metrics} />);

    expect(screen.getByText('Export CSV')).toBeInTheDocument();
  });

  it('shows no data message when metrics are empty', () => {
    render(<TransitionMetrics metrics={[]} />);

    expect(screen.getByText(/No transition data available/)).toBeInTheDocument();
  });

  it('shows no data message when metrics are null', () => {
    render(<TransitionMetrics metrics={null} />);

    expect(screen.getByText(/No transition data available/)).toBeInTheDocument();
  });
});
