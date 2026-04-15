# Financial Crime Process Mining Capability

A process mining platform for monitoring investigation case throughput and workflow transition times across a financial crime investigations pipeline.

## Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React + React Flow + Recharts | State flow visualisation, dashboards, filtering |
| Backend | Spring Boot 3.2 (Java 17) | REST API services |
| Database | PostgreSQL 16 | Case data, transitions, reference data |

## Workflow States

```
NEW → UNDER INVESTIGATION → REVIEW → CLOSED
              ↕
      AWAITING INFORMATION
```

- **New** — Case created, pending assignment
- **Under Investigation** — Analyst actively working the case
- **Awaiting Information** — Blocked on external information (loops back to Under Investigation)
- **Review** — Senior review before closure
- **Closed** — Investigation complete

## Breakdown Dimensions

- **Case Type**: Suspicious Activity Report, Transaction Monitoring Alert, KYC Remediation, Fraud Investigation, Sanctions Screening Hit
- **Country**: UK, USA, Germany, France, Singapore, Hong Kong, Australia
- **Line of Business**: Retail, Commercial

## Test Data

120 investigation cases pre-loaded across all workflow states:
- 40 Closed (full lifecycle with transition history)
- 20 In Review
- 25 Under Investigation
- 10 Awaiting Information
- 25 New

## Quick Start

### Using Docker Compose

```bash
docker-compose up --build
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Database**: localhost:5432

### Manual Setup

#### Database
```bash
# Start PostgreSQL and create database
createdb process_mining
psql -d process_mining -f database/schema.sql
```

#### Backend
```bash
cd backend
mvn spring-boot:run
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard` | Dashboard metrics (status counts, transition metrics, process flow) |
| GET | `/api/cases` | List investigation cases |
| GET | `/api/cases/{id}/transitions` | Transition history for a case |
| GET | `/api/filters` | Available filter options |

All list endpoints support optional query parameters: `caseTypeId`, `countryId`, `lineOfBusiness`

## UI Features

- **Overview Tab**: Status distribution cards, transition metrics table, average duration bar chart
- **Process Flow Tab**: Interactive state flow diagram with case counts and average durations on edges
- **Cases Tab**: Searchable case list with click-through to transition timeline
- **Filter Bar**: Filter all views by case type, country, and line of business