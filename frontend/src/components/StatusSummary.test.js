import React from 'react';
import { render, screen } from '@testing-library/react';
import StatusSummary from './StatusSummary';

describe('StatusSummary', () => {
  const fullCounts = [
    { status: 'NEW', count: 10 },
    { status: 'UNDER_INVESTIGATION', count: 25 },
    { status: 'AWAITING_INFORMATION', count: 7 },
    { status: 'REVIEW', count: 12 },
    { status: 'CLOSED', count: 40 },
  ];

  it('renders all five status cards', () => {
    render(<StatusSummary statusCounts={fullCounts} />);

    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Under Investigation')).toBeInTheDocument();
    expect(screen.getByText('Awaiting Info')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });

  it('displays correct counts', () => {
    render(<StatusSummary statusCounts={fullCounts} />);

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
  });

  it('shows zero for missing statuses', () => {
    render(<StatusSummary statusCounts={[{ status: 'NEW', count: 5 }]} />);

    expect(screen.getByText('5')).toBeInTheDocument();
    // The other four should show 0
    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(4);
  });

  it('shows all zeros for empty array', () => {
    render(<StatusSummary statusCounts={[]} />);

    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(5);
  });
});
