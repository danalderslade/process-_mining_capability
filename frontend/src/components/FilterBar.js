import React from 'react';

const FilterBar = ({ options, filters, onChange, onClear }) => {
  return (
    <div className="filters-bar">
      <div className="filter-group">
        <label>Case Type</label>
        <select
          value={filters.caseTypeId || ''}
          onChange={(e) => onChange('caseTypeId', e.target.value || null)}
        >
          <option value="">All Case Types</option>
          {options.caseTypes.map(ct => (
            <option key={ct.id} value={ct.id}>{ct.name}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Country</label>
        <select
          value={filters.countryId || ''}
          onChange={(e) => onChange('countryId', e.target.value || null)}
        >
          <option value="">All Countries</option>
          {options.countries.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Line of Business</label>
        <select
          value={filters.lineOfBusiness || ''}
          onChange={(e) => onChange('lineOfBusiness', e.target.value || null)}
        >
          <option value="">All</option>
          {options.linesOfBusiness.map(lob => (
            <option key={lob} value={lob}>
              {lob === 'RETAIL' ? 'Retail' : 'Commercial'}
            </option>
          ))}
        </select>
      </div>

      {Object.keys(filters).length > 0 && (
        <button className="clear-filters-btn" onClick={onClear}>
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;
