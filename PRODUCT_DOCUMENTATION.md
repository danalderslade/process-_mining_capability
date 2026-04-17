# Case Management - Process Mining Tool

## Product Documentation

---

## Part 1: Business Overview

### What Is This Product?

The **Process Mining Capability** is a real-time analytics dashboard that gives financial crime operations teams complete visibility into how investigation cases flow through your organisation — from the moment a case is created to the point it is closed.

It answers the questions that matter most to operations leaders:

- **Where are our cases right now?** — See live counts across every workflow stage.
- **Where are the bottlenecks?** — Identify which transitions take the longest and where cases get stuck.
- **Are we getting faster?** — Track month-over-month improvement in investigation processing times.
- **What does the workload look like?** — Filter by case type, country, or line of business to understand regional and portfolio-level patterns.

---

### Who Is It For?

| Role | What They Get |
|------|---------------|
| **Head of Financial Crime Operations** | Strategic view of end-to-end process efficiency, trend data to demonstrate operational improvement to regulators and senior management |
| **Team Leads / Managers** | Workload distribution across statuses, ability to filter by their country or LOB to see team-specific performance |
| **Process Improvement / Transformation** | Data-driven evidence of where process interventions are needed, before-and-after trend measurement |
| **Internal Audit / Compliance** | Transparent audit trail of every case state change, exportable data for regulatory reporting |
| **Technology / Architecture** | Lightweight, modern stack that integrates with existing case management systems |

---

### Key Capabilities

#### 1. Live Status Dashboard

Five colour-coded status cards show the real-time distribution of cases across the investigation lifecycle:

| Status | Meaning |
|--------|---------|
| **New** | Case has been raised but not yet assigned |
| **Under Investigation** | Analyst is actively working the case |
| **Awaiting Information** | Case is blocked pending external or internal information |
| **Review** | Investigation complete, awaiting manager sign-off |
| **Closed** | Case fully resolved |

All numbers update instantly when filters are applied.

#### 2. Interactive Process Flow Diagram

A visual state diagram shows the investigation workflow as a directed graph. Two viewing modes allow you to switch between:

- **Case Throughput** — How many cases flow along each path, with average processing time on each edge.
- **Time in State** — Weighted average dwell time displayed on each node, highlighting where cases spend the most time.

Edge thickness scales with volume, making high-traffic paths immediately visible.

#### 3. Investigation Trend Analysis

A line chart tracks the average time taken to move a case from *Under Investigation* to *Manager Review* — month by month. A green improvement badge at the top calculates the percentage speed-up from the first month to the most recent.

**Example insight:** *"Investigation-to-review time has improved by 87%, from 18.0 days in March down to 2.2 days in October."*

This is the single most powerful slide in any operational improvement story.

#### 4. Transition Metrics Table

A sortable, filterable table shows every state-to-state transition with:

- **Count** — How many times this transition occurred
- **Average Duration** — Colour-coded: green (< 2 days), orange (2–7 days), red (> 7 days)

Supports column sorting, free-text filtering on every field, and **CSV export** for offline analysis or inclusion in reports.

#### 5. Throughput Chart

A bar chart comparing average processing time across all transition types, coloured by transition. Quickly reveals which handoffs are the slowest.

#### 6. Full Case List with Drill-Down

An enterprise-grade data grid (AG Grid) showing every investigation case with:

- Case reference, type, country, line of business, status, and creation date
- **Sort** any column ascending/descending
- **Filter** every column with free-text search
- **Click any row** to see the complete transition timeline for that case — every status change, when it happened, and who made it
- **Export all data to CSV** with one click

#### 7. Global Filters

Three filters apply across the entire dashboard simultaneously:

| Filter | Options |
|--------|---------|
| **Case Type** | Suspicious Activity Report, Transaction Monitoring Alert, KYC Remediation, Fraud Investigation, Sanctions Screening Hit |
| **Country** | United Kingdom, United States, Germany, France, Singapore, Hong Kong, Australia |
| **Line of Business** | Retail, Commercial |

This means a team lead in Singapore can filter to see only their Retail SAR cases and get a fully tailored view — status counts, flow diagram, trend chart, tables — all scoped to their portfolio.

---

### Business Value Proposition

| Challenge | How This Product Helps |
|-----------|----------------------|
| **"We don't know where our cases are"** | Real-time status counts with drill-down to individual cases |
| **"We can't identify bottlenecks"** | Process flow diagram and transition metrics highlight slow handoffs |
| **"We can't prove we're improving"** | Month-over-month trend chart with percentage improvement calculation |
| **"Regulatory reporting is manual"** | CSV export on every table, full audit trail on every case |
| **"Each region works in isolation"** | Global filters let any team see their own data within a single shared platform |
| **"Building analytics takes months"** | Lightweight stack deploys in hours, not months — no enterprise BI tool required |

---

### Sample Use Cases

**1. Quarterly Business Review**
Pull up the trend chart showing 87% improvement in investigation time. Export transition metrics as CSV. Present to COO with concrete evidence of operational transformation.

**2. Daily Stand-Up**
Filter by your country and LOB. Check how many cases are in *Awaiting Information* (potential blockers). Click into any case to see who last touched it and when.

**3. Regulatory Examination**
Demonstrate full traceability: click any case, show the complete timeline of status changes with timestamps and user attribution. Export the full case list for the examiner.

**4. Process Re-Engineering**
Switch to *Time in State* view on the flow diagram. Identify that cases spend an average of 12 days in *Awaiting Information*. Target that stage for improvement — then measure the impact next quarter.

---

---

## Part 2: Technical Documentation

### Architecture Overview

```
┌─────────────┐      ┌──────────────────┐      ┌──────────────┐
│   React UI  │─────▶│  Spring Boot API │─────▶│  PostgreSQL  │
│  Port 3000  │ HTTP │    Port 8080     │ JDBC │   Port 5432  │
└─────────────┘      └──────────────────┘      └──────────────┘
```

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 18.2.0 |
| **Data Grid** | AG Grid Community | 35.2.1 |
| **Flow Diagram** | React Flow | 11.11.3 |
| **Charts** | Recharts | 2.12.0 |
| **HTTP Client** | Axios | 1.6.7 |
| **Backend** | Spring Boot | 3.2.4 |
| **Language** | Java | 21 |
| **ORM** | Hibernate / Spring Data JPA | 6.4.4 |
| **Database** | PostgreSQL | 16 |
| **Migrations** | Flyway | (Spring Boot managed) |
| **Build (Backend)** | Maven | 4.x |
| **Build (Frontend)** | Create React App | 5.0.1 |

---

### API Reference

Base URL: `http://localhost:8080/api`

#### GET `/api/dashboard`

Returns all dashboard metrics. Supports optional query parameters for filtering.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `caseTypeId` | Integer | No | Filter by case type ID (1–5) |
| `countryId` | Integer | No | Filter by country ID (1–7) |
| `lineOfBusiness` | String | No | `RETAIL` or `COMMERCIAL` |

**Response:**

```json
{
  "statusCounts": [
    { "status": "NEW", "count": 25 },
    { "status": "UNDER_INVESTIGATION", "count": 25 },
    { "status": "AWAITING_INFORMATION", "count": 10 },
    { "status": "REVIEW", "count": 20 },
    { "status": "CLOSED", "count": 40 }
  ],
  "totalCases": 120,
  "transitionMetrics": [
    { "fromStatus": "NEW", "toStatus": "UNDER_INVESTIGATION", "count": 45, "avgHours": 24.5 }
  ],
  "processFlow": {
    "statuses": ["NEW", "UNDER_INVESTIGATION", "AWAITING_INFORMATION", "REVIEW", "CLOSED"],
    "edges": [
      { "from": "NEW", "to": "UNDER_INVESTIGATION", "count": 45, "avgHours": 24.5 }
    ]
  },
  "investigationToReviewTrend": [
    { "month": "2025-03", "avgHours": 432.0, "count": 8 }
  ]
}
```

#### GET `/api/cases`

Returns a filtered list of investigation cases.

**Parameters:** Same as `/api/dashboard`

**Response:**

```json
[
  {
    "id": 1,
    "caseReference": "FC-2025-0001",
    "caseType": "Suspicious Activity Report",
    "country": "United Kingdom",
    "countryCode": "GBR",
    "lineOfBusiness": "RETAIL",
    "currentStatus": "CLOSED",
    "createdAt": "2025-09-01T08:00:00",
    "updatedAt": "2025-09-18T14:30:00"
  }
]
```

#### GET `/api/cases/{caseId}/transitions`

Returns the full transition history for a single case, ordered chronologically.

**Response:**

```json
[
  {
    "fromStatus": null,
    "toStatus": "NEW",
    "transitionedAt": "2025-09-01T08:00:00",
    "transitionedBy": "system"
  },
  {
    "fromStatus": "NEW",
    "toStatus": "UNDER_INVESTIGATION",
    "transitionedAt": "2025-09-02T10:15:00",
    "transitionedBy": "analyst1@bank.com"
  }
]
```

#### GET `/api/filters`

Returns available options for all filter dropdowns.

**Response:**

```json
{
  "caseTypes": [
    { "id": 1, "name": "Suspicious Activity Report" },
    { "id": 2, "name": "Transaction Monitoring Alert" },
    { "id": 3, "name": "KYC Remediation" },
    { "id": 4, "name": "Fraud Investigation" },
    { "id": 5, "name": "Sanctions Screening Hit" }
  ],
  "countries": [
    { "id": 1, "name": "United Kingdom" },
    { "id": 2, "name": "United States" },
    { "id": 3, "name": "Germany" },
    { "id": 4, "name": "France" },
    { "id": 5, "name": "Singapore" },
    { "id": 6, "name": "Hong Kong" },
    { "id": 7, "name": "Australia" }
  ],
  "linesOfBusiness": ["RETAIL", "COMMERCIAL"]
}
```

---

### Database Schema

#### Entity Relationship

```
case_types (1) ──── (N) investigation_cases (1) ──── (N) case_transitions
countries  (1) ──── (N) investigation_cases
workflow_statuses (1) ──── (N) investigation_cases (current_status)
workflow_statuses (1) ──── (N) case_transitions (from_status, to_status)
```

#### Tables

**`investigation_cases`**

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | SERIAL | PRIMARY KEY |
| `case_reference` | VARCHAR(20) | UNIQUE, NOT NULL |
| `case_type_id` | INTEGER | FK → case_types |
| `country_id` | INTEGER | FK → countries |
| `line_of_business` | VARCHAR(20) | CHECK IN ('RETAIL', 'COMMERCIAL') |
| `current_status_id` | INTEGER | FK → workflow_statuses |
| `created_at` | TIMESTAMP | NOT NULL |
| `updated_at` | TIMESTAMP | NOT NULL |

**`case_transitions`**

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | SERIAL | PRIMARY KEY |
| `case_id` | INTEGER | FK → investigation_cases |
| `from_status_id` | INTEGER | FK → workflow_statuses (nullable for creation) |
| `to_status_id` | INTEGER | FK → workflow_statuses |
| `transitioned_at` | TIMESTAMP | NOT NULL |
| `transitioned_by` | VARCHAR(100) | NOT NULL |

**`workflow_statuses`** — NEW, UNDER_INVESTIGATION, AWAITING_INFORMATION, REVIEW, CLOSED

**`case_types`** — 5 investigation types (SAR, TM Alert, KYC, Fraud, Sanctions)

**`countries`** — 7 countries with ISO 3-letter codes

#### Indexes

| Index | Table | Columns | Purpose |
|-------|-------|---------|---------|
| `idx_case_transitions_case_id` | case_transitions | case_id | Case drill-down queries |
| `idx_case_transitions_from_to` | case_transitions | from_status_id, to_status_id | Transition metric aggregation |
| `idx_case_transitions_transitioned_at` | case_transitions | transitioned_at | Trend analysis date range queries |
| `idx_investigation_cases_status` | investigation_cases | current_status_id | Status count aggregation |
| `idx_investigation_cases_case_type` | investigation_cases | case_type_id | Filter by case type |
| `idx_investigation_cases_country` | investigation_cases | country_id | Filter by country |
| `idx_investigation_cases_lob` | investigation_cases | line_of_business | Filter by line of business |

---

### Flyway Migrations

| Version | Description |
|---------|-------------|
| **V1** | Initial schema — all tables, indexes, constraints, and master data |
| **V2** | Test data — 120 investigation cases with realistic transition histories |
| **V3** | Timestamp adjustments to demonstrate month-over-month investigation time improvement (March–October) |

---

### Frontend Component Architecture

```
App.js
├── FilterBar.js              — Global filter dropdowns (case type, country, LOB)
├── Tab: Overview
│   ├── StatusSummary.js      — 5 status count cards
│   ├── TrendChart.js         — Investigation-to-review time trend (Recharts LineChart)
│   ├── TransitionMetrics.js  — From/To metrics table (AG Grid)
│   └── ThroughputChart.js    — Avg hours per transition (Recharts BarChart)
├── Tab: Process Flow
│   └── StateFlowDiagram.js   — Interactive state diagram (React Flow)
│       └── Toggle: Case Throughput / Time in State
└── Tab: Cases
    └── CasesTable.js         — Full case list (AG Grid)
        └── CaseDetailModal   — Transition timeline on row click
```

---

### Running Locally

**Prerequisites:** Docker, Java 21+, Node.js 18+, Maven

```bash
# 1. Start PostgreSQL
docker run -d --name process-mining-pg \
  -e POSTGRES_DB=process_mining \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16-alpine

# 2. Start Backend (applies Flyway migrations automatically)
cd backend
mvn spring-boot:run

# 3. Start Frontend
cd frontend
npm install
npm start
```

The application will be available at `http://localhost:3000`. The frontend proxies API requests to `http://localhost:8080`.

---

### Test Data Profile

The system ships with 120 pre-loaded investigation cases:

| Attribute | Distribution |
|-----------|-------------|
| **Statuses** | 25 New, 25 Under Investigation, 10 Awaiting Information, 20 Review, 40 Closed |
| **Case Types** | Random mix across all 5 types |
| **Countries** | Random mix across all 7 countries |
| **LOB** | ~50/50 Retail and Commercial |
| **Analysts** | analyst1@bank.com, analyst2@bank.com, analyst3@bank.com, senior1@bank.com, senior2@bank.com |
| **Date Range** | March 2025 – October 2025 |
| **Trend Story** | Investigation-to-review time decreases from ~18 days (March) to ~2.2 days (October) |

---

### Integration Points

This platform is designed to connect with existing case management systems. Key integration surfaces:

| Integration | Method | Detail |
|-------------|--------|--------|
| **Ingest cases** | Direct DB insert or API extension | Add new cases and transitions to `investigation_cases` and `case_transitions` tables |
| **Real-time sync** | Database triggers or CDC | Use Change Data Capture from your case management system to keep the process mining DB in sync |
| **SSO / Auth** | Spring Security (not yet configured) | Add OAuth2/OIDC or SAML integration for enterprise authentication |
| **Export** | CSV export (built-in) | All table data exportable via the UI; API responses are standard JSON |
| **Embedding** | iframe or micro-frontend | The React app can be embedded in existing portals |

---

### Security Considerations

| Area | Current State | Production Recommendation |
|------|--------------|--------------------------|
| **Authentication** | None (demo mode) | Add Spring Security with OAuth2/SAML SSO |
| **Authorisation** | None | Role-based access: read-only for analysts, admin for config |
| **CORS** | Open (dev proxy) | Restrict to known origins |
| **Database** | Default credentials | Use secrets management (Vault, AWS Secrets Manager) |
| **HTTPS** | HTTP only | Terminate TLS at load balancer or reverse proxy |
| **Input Validation** | Parameterised queries (SQL injection safe) | Add rate limiting and request validation |
