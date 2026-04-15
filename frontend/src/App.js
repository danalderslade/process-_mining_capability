import React, { useState, useEffect } from 'react';
import { fetchDashboard, fetchCases, fetchFilters } from './api';
import StateFlowDiagram from './components/StateFlowDiagram';
import StatusSummary from './components/StatusSummary';
import TransitionMetrics from './components/TransitionMetrics';
import CasesTable from './components/CasesTable';
import FilterBar from './components/FilterBar';
import ThroughputChart from './components/ThroughputChart';
import TrendChart from './components/TrendChart';

function App() {
  const [dashboard, setDashboard] = useState(null);
  const [cases, setCases] = useState([]);
  const [filterOptions, setFilterOptions] = useState(null);
  const [filters, setFilters] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFilters().then(setFilterOptions).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchDashboard(filters),
      fetchCases(filters)
    ]).then(([dashData, casesData]) => {
      setDashboard(dashData);
      setCases(casesData);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const next = { ...prev };
      if (value) {
        next[key] = value;
      } else {
        delete next[key];
      }
      return next;
    });
  };

  const clearFilters = () => setFilters({});

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>
            <span className="icon">◆</span>
            HSBC FinCrime Process Mining
          </h1>
          <div className="header-subtitle">Financial Crime Investigation Analytics</div>
        </div>
        {dashboard && (
          <div className="total-badge">{dashboard.totalCases} Total Cases</div>
        )}
      </header>

      <main className="main-content">
        {filterOptions && (
          <FilterBar
            options={filterOptions}
            filters={filters}
            onChange={handleFilterChange}
            onClear={clearFilters}
          />
        )}

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === 'flow' ? 'active' : ''}`}
            onClick={() => setActiveTab('flow')}
          >
            Process Flow
          </button>
          <button
            className={`tab ${activeTab === 'cases' ? 'active' : ''}`}
            onClick={() => setActiveTab('cases')}
          >
            Cases
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="loading-spinner" />
            Loading dashboard data...
          </div>
        ) : (
          <>
            {activeTab === 'overview' && dashboard && (
              <>
                <StatusSummary statusCounts={dashboard.statusCounts} />
                <div className="dashboard-grid">
                  <div className="card full-width">
                    <div className="card-header">
                      <h2>Investigation to Review — Processing Time Trend</h2>
                      <span className="trend-label">Under Investigation → Manager Review</span>
                    </div>
                    <div className="card-body">
                      <TrendChart trend={dashboard.investigationToReviewTrend} />
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header">
                      <h2>Transition Metrics</h2>
                    </div>
                    <div className="card-body">
                      <TransitionMetrics metrics={dashboard.transitionMetrics} />
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header">
                      <h2>Average Duration by Step (Hours)</h2>
                    </div>
                    <div className="card-body">
                      <ThroughputChart metrics={dashboard.transitionMetrics} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'flow' && dashboard && (
              <div className="card full-width">
                <div className="card-header">
                  <h2>Investigation Workflow State Flow</h2>
                </div>
                <div className="card-body">
                  <StateFlowDiagram processFlow={dashboard.processFlow} />
                </div>
              </div>
            )}

            {activeTab === 'cases' && (
              <div className="card">
                <div className="card-header">
                  <h2>Investigation Cases</h2>
                  <span className="total-badge">{cases.length} cases</span>
                </div>
                <div className="card-body">
                  <CasesTable cases={cases} />
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
