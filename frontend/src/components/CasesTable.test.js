import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CasesTable from './CasesTable';
import * as api from '../api';

jest.mock('../api');

// Mock AG Grid
jest.mock('ag-grid-react', () => ({
  AgGridReact: (props) => (
    <div data-testid="ag-grid">
      {props.rowData && props.rowData.map((row, i) => (
        <div
          key={i}
          data-testid={`row-${i}`}
          onClick={() => props.onRowClicked && props.onRowClicked({ data: row })}
        >
          {row.caseReference} | {row.caseType} | {row.currentStatus}
        </div>
      ))}
    </div>
  ),
}));

jest.mock('ag-grid-community', () => ({
  AllCommunityModule: {},
  ModuleRegistry: { registerModules: jest.fn() },
}));

describe('CasesTable', () => {
  const cases = [
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
    {
      id: 2,
      caseReference: 'FC-002',
      caseType: 'AML',
      country: 'Hong Kong',
      countryCode: 'HKG',
      lineOfBusiness: 'COMMERCIAL',
      currentStatus: 'CLOSED',
      createdAt: '2025-02-10T11:00:00',
      updatedAt: '2025-05-20T16:30:00',
    },
  ];

  it('renders the grid with case data', () => {
    render(<CasesTable cases={cases} />);

    expect(screen.getByTestId('ag-grid')).toBeInTheDocument();
    expect(screen.getByTestId('row-0')).toHaveTextContent('FC-001');
    expect(screen.getByTestId('row-1')).toHaveTextContent('FC-002');
  });

  it('shows Export CSV button', () => {
    render(<CasesTable cases={cases} />);

    expect(screen.getByText('Export CSV')).toBeInTheDocument();
  });

  it('opens modal when row is clicked', async () => {
    api.fetchCaseTransitions.mockResolvedValue([
      { fromStatus: null, toStatus: 'NEW', transitionedAt: '2025-01-15T09:00:00', transitionedBy: 'system' },
    ]);

    render(<CasesTable cases={cases} />);

    fireEvent.click(screen.getByTestId('row-0'));

    await waitFor(() => {
      expect(screen.getByText('FC-001')).toBeInTheDocument();
    });
  });

  it('renders empty grid when no cases', () => {
    render(<CasesTable cases={[]} />);

    expect(screen.getByTestId('ag-grid')).toBeInTheDocument();
  });
});
