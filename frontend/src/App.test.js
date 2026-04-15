import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import * as api from './api';

jest.mock('./api');
jest.mock('./components/StateFlowDiagram', () => () => <div data-testid="flow-diagram" />);
jest.mock('./components/ThroughputChart', () => ({ metrics }) => <div data-testid="throughput-chart" />);
jest.mock('./components/TrendChart', () => ({ trend }) => <div data-testid="trend-chart" />);

const mockFilterOptions = {
  caseTypes: [{ id: 1, name: 'Fraud' }, { id: 2, name: 'AML' }],
  countries: [{ id: 1, name: 'United Kingdom' }],
  linesOfBusiness: ['RETAIL', 'COMMERCIAL'],
};

const mockDashboard = {
  statusCounts: [
    { status: 'NEW', count: 10 },
    { status: 'UNDER_INVESTIGATION', count: 20 },
    { status: 'AWAITING_INFORMATION', count: 5 },
    { status: 'REVIEW', count: 8 },
    { status: 'CLOSED', count: 15 },
  ],
  totalCases: 58,
  transitionMetrics: [
    { fromStatus: 'NEW', toStatus: 'UNDER_INVESTIGATION', count: 50, avgHours: 12.5 },
  ],
  processFlow: {
    statuses: ['NEW', 'UNDER_INVESTIGATION'],
    edges: [],
  },
  investigationToReviewTrend: [
    { month: '2025-03', avgHours: 432, count: 10 },
    { month: '2025-04', avgHours: 360, count: 12 },
  ],
};

const mockCases = [
  {
    id: 1,
    caseReference: 'FC-001',
    caseType: 'Fraud',
    country: 'United Kingdom',
    countryCode: 'GBR',
    lineOfBusiness: 'RETAIL',
    currentStatus: 'NEW',
    createdAt: '2025-01-15T09:00:00',
    updatedAt: '2025-06-01T14:00:00',
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  api.fetchFilters.mockResolvedValue(mockFilterOptions);
  api.fetchDashboard.mockResolvedValue(mockDashboard);
  api.fetchCases.mockResolvedValue(mockCases);
});

describe('App', () => {
  it('renders header with app name', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Bank Masterpiece/)).toBeInTheDocument();
    });
  });

  it('shows loading spinner initially', () => {
    api.fetchDashboard.mockReturnValue(new Promise(() => {}));
    api.fetchCases.mockReturnValue(new Promise(() => {}));
    render(<App />);
    expect(screen.getByText(/Loading dashboard data/)).toBeInTheDocument();
  });

  it('displays total cases badge after loading', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('58 Total Cases')).toBeInTheDocument();
    });
  });

  it('renders status summary cards on overview tab', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
    });
  });

  it('renders trend chart on overview tab', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('trend-chart')).toBeInTheDocument();
    });
  });

  it('switches to process flow tab', async () => {
    render(<App />);
    await waitFor(() => screen.getByText('Process Flow'));
    fireEvent.click(screen.getByText('Process Flow'));
    expect(screen.getByTestId('flow-diagram')).toBeInTheDocument();
  });

  it('switches to cases tab', async () => {
    render(<App />);
    await waitFor(() => screen.getByText('Cases'));
    fireEvent.click(screen.getByText('Cases'));
    await waitFor(() => {
      expect(screen.getByText('Investigation Cases')).toBeInTheDocument();
    });
  });

  it('renders filter bar with options', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('All Case Types')).toBeInTheDocument();
      expect(screen.getByText('All Countries')).toBeInTheDocument();
    });
  });

  it('displays error banner on API failure', async () => {
    api.fetchDashboard.mockRejectedValue(new Error('Server unavailable'));
    api.fetchCases.mockRejectedValue(new Error('Server unavailable'));

    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Server unavailable/)).toBeInTheDocument();
    });
  });

  it('dismisses error banner on close click', async () => {
    api.fetchDashboard.mockRejectedValue(new Error('Temp error'));
    api.fetchCases.mockRejectedValue(new Error('Temp error'));

    render(<App />);
    await waitFor(() => screen.getByText(/Temp error/));
    fireEvent.click(screen.getByText('✕'));
    expect(screen.queryByText(/Temp error/)).not.toBeInTheDocument();
  });

  it('has a link to the product pitch PDF', async () => {
    render(<App />);
    await waitFor(() => {
      const link = screen.getByText(/Product Pitch/);
      expect(link).toBeInTheDocument();
      expect(link.closest('a')).toHaveAttribute('href', '/Bank_Masterpiece_Pitch.pdf');
      expect(link.closest('a')).toHaveAttribute('target', '_blank');
    });
  });

  it('calls fetchDashboard with filters when filter changes', async () => {
    render(<App />);
    await waitFor(() => screen.getByText('All Case Types'));

    const caseTypeSelect = screen.getByText('All Case Types').closest('select');
    fireEvent.change(caseTypeSelect, { target: { value: '1' } });

    await waitFor(() => {
      expect(api.fetchDashboard).toHaveBeenCalledWith(
        expect.objectContaining({ caseTypeId: '1' })
      );
    });
  });
});
