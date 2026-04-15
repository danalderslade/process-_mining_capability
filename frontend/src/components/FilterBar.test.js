import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterBar from './FilterBar';

const defaultOptions = {
  caseTypes: [
    { id: 1, name: 'Fraud' },
    { id: 2, name: 'AML' },
  ],
  countries: [
    { id: 1, name: 'United Kingdom' },
    { id: 2, name: 'Hong Kong' },
  ],
  linesOfBusiness: ['RETAIL', 'COMMERCIAL'],
};

describe('FilterBar', () => {
  it('renders all three filter dropdowns', () => {
    render(<FilterBar options={defaultOptions} filters={{}} onChange={jest.fn()} onClear={jest.fn()} />);

    expect(screen.getByText('All Case Types')).toBeInTheDocument();
    expect(screen.getByText('All Countries')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('renders case type options', () => {
    render(<FilterBar options={defaultOptions} filters={{}} onChange={jest.fn()} onClear={jest.fn()} />);

    expect(screen.getByText('Fraud')).toBeInTheDocument();
    expect(screen.getByText('AML')).toBeInTheDocument();
  });

  it('renders country options', () => {
    render(<FilterBar options={defaultOptions} filters={{}} onChange={jest.fn()} onClear={jest.fn()} />);

    expect(screen.getByText('United Kingdom')).toBeInTheDocument();
    expect(screen.getByText('Hong Kong')).toBeInTheDocument();
  });

  it('renders LOB options with friendly labels', () => {
    render(<FilterBar options={defaultOptions} filters={{}} onChange={jest.fn()} onClear={jest.fn()} />);

    expect(screen.getByText('Retail')).toBeInTheDocument();
    expect(screen.getByText('Commercial')).toBeInTheDocument();
  });

  it('calls onChange when case type is selected', () => {
    const onChange = jest.fn();
    render(<FilterBar options={defaultOptions} filters={{}} onChange={onChange} onClear={jest.fn()} />);

    const select = screen.getByText('All Case Types').closest('select');
    fireEvent.change(select, { target: { value: '1' } });

    expect(onChange).toHaveBeenCalledWith('caseTypeId', '1');
  });

  it('calls onChange with null when default option selected', () => {
    const onChange = jest.fn();
    render(<FilterBar options={defaultOptions} filters={{ caseTypeId: '1' }} onChange={onChange} onClear={jest.fn()} />);

    const select = screen.getByText('Fraud').closest('select');
    fireEvent.change(select, { target: { value: '' } });

    expect(onChange).toHaveBeenCalledWith('caseTypeId', null);
  });

  it('does not show clear button when no filters active', () => {
    render(<FilterBar options={defaultOptions} filters={{}} onChange={jest.fn()} onClear={jest.fn()} />);

    expect(screen.queryByText('Clear Filters')).not.toBeInTheDocument();
  });

  it('shows clear button when filters are active', () => {
    render(<FilterBar options={defaultOptions} filters={{ caseTypeId: '1' }} onChange={jest.fn()} onClear={jest.fn()} />);

    expect(screen.getByText('Clear Filters')).toBeInTheDocument();
  });

  it('calls onClear when clear button clicked', () => {
    const onClear = jest.fn();
    render(<FilterBar options={defaultOptions} filters={{ caseTypeId: '1' }} onChange={jest.fn()} onClear={onClear} />);

    fireEvent.click(screen.getByText('Clear Filters'));

    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
