-- Schema creation
CREATE TABLE IF NOT EXISTS case_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    code VARCHAR(3) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS workflow_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_order INT NOT NULL
);

CREATE TABLE IF NOT EXISTS investigation_cases (
    id SERIAL PRIMARY KEY,
    case_reference VARCHAR(20) NOT NULL UNIQUE,
    case_type_id INT NOT NULL REFERENCES case_types(id),
    country_id INT NOT NULL REFERENCES countries(id),
    line_of_business VARCHAR(20) NOT NULL CHECK (line_of_business IN ('RETAIL', 'COMMERCIAL')),
    current_status_id INT NOT NULL REFERENCES workflow_statuses(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS case_transitions (
    id SERIAL PRIMARY KEY,
    case_id INT NOT NULL REFERENCES investigation_cases(id),
    from_status_id INT REFERENCES workflow_statuses(id),
    to_status_id INT NOT NULL REFERENCES workflow_statuses(id),
    transitioned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    transitioned_by VARCHAR(100)
);

CREATE INDEX idx_case_transitions_case_id ON case_transitions(case_id);
CREATE INDEX idx_case_transitions_from_to ON case_transitions(from_status_id, to_status_id);
CREATE INDEX idx_case_transitions_transitioned_at ON case_transitions(transitioned_at);
CREATE INDEX idx_investigation_cases_status ON investigation_cases(current_status_id);
CREATE INDEX idx_investigation_cases_case_type ON investigation_cases(case_type_id);
CREATE INDEX idx_investigation_cases_country ON investigation_cases(country_id);
CREATE INDEX idx_investigation_cases_lob ON investigation_cases(line_of_business);

-- Reference data
INSERT INTO workflow_statuses (name, display_order) VALUES
    ('NEW', 1),
    ('UNDER_INVESTIGATION', 2),
    ('AWAITING_INFORMATION', 3),
    ('REVIEW', 4),
    ('CLOSED', 5);

INSERT INTO case_types (name) VALUES
    ('Suspicious Activity Report'),
    ('Transaction Monitoring Alert'),
    ('KYC Remediation'),
    ('Fraud Investigation'),
    ('Sanctions Screening Hit');

INSERT INTO countries (code, name) VALUES
    ('GBR', 'United Kingdom'),
    ('USA', 'United States'),
    ('DEU', 'Germany'),
    ('FRA', 'France'),
    ('SGP', 'Singapore'),
    ('HKG', 'Hong Kong'),
    ('AUS', 'Australia');
