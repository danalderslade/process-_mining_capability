-- Test data: 120 investigation cases with realistic transition histories
-- Workflow: NEW(1) -> UNDER_INVESTIGATION(2) -> AWAITING_INFORMATION(3) <-> UNDER_INVESTIGATION(2) -> REVIEW(4) -> CLOSED(5)

-- Investigators
-- analyst1@bank.com, analyst2@bank.com, analyst3@bank.com, senior1@bank.com, senior2@bank.com

-- =============================================
-- CLOSED CASES (40 cases) - Full lifecycle
-- =============================================

-- Case 1: SAR, UK, Retail - straightforward path
INSERT INTO investigation_cases (case_reference, case_type_id, country_id, line_of_business, current_status_id, created_at, updated_at) VALUES
('FC-2025-0001', 1, 1, 'RETAIL', 5, '2025-09-01 08:00:00', '2025-09-18 14:30:00');
INSERT INTO case_transitions (case_id, from_status_id, to_status_id, transitioned_at, transitioned_by) VALUES
(1, NULL, 1, '2025-09-01 08:00:00', 'system'),
(1, 1, 2, '2025-09-02 10:15:00', 'analyst1@bank.com'),
(1, 2, 4, '2025-09-15 09:00:00', 'analyst1@bank.com'),
(1, 4, 5, '2025-09-18 14:30:00', 'senior1@bank.com');

-- Case 2: TM Alert, USA, Commercial - with awaiting info loop
INSERT INTO investigation_cases (case_reference, case_type_id, country_id, line_of_business, current_status_id, created_at, updated_at) VALUES
('FC-2025-0002', 2, 2, 'COMMERCIAL', 5, '2025-09-03 09:30:00', '2025-10-02 16:00:00');
INSERT INTO case_transitions (case_id, from_status_id, to_status_id, transitioned_at, transitioned_by) VALUES
(2, NULL, 1, '2025-09-03 09:30:00', 'system'),
(2, 1, 2, '2025-09-04 11:00:00', 'analyst2@bank.com'),
(2, 2, 3, '2025-09-10 14:00:00', 'analyst2@bank.com'),
(2, 3, 2, '2025-09-17 09:30:00', 'analyst2@bank.com'),
(2, 2, 4, '2025-09-28 10:00:00', 'analyst2@bank.com'),
(2, 4, 5, '2025-10-02 16:00:00', 'senior1@bank.com');

-- Case 3: KYC, Germany, Retail
INSERT INTO investigation_cases (case_reference, case_type_id, country_id, line_of_business, current_status_id, created_at, updated_at) VALUES
('FC-2025-0003', 3, 3, 'RETAIL', 5, '2025-08-15 07:45:00', '2025-09-10 11:00:00');
INSERT INTO case_transitions (case_id, from_status_id, to_status_id, transitioned_at, transitioned_by) VALUES
(3, NULL, 1, '2025-08-15 07:45:00', 'system'),
(3, 1, 2, '2025-08-16 09:00:00', 'analyst3@bank.com'),
(3, 2, 4, '2025-09-05 15:00:00', 'analyst3@bank.com'),
(3, 4, 5, '2025-09-10 11:00:00', 'senior2@bank.com');

-- Case 4: Fraud, France, Commercial - double awaiting info
INSERT INTO investigation_cases (case_reference, case_type_id, country_id, line_of_business, current_status_id, created_at, updated_at) VALUES
('FC-2025-0004', 4, 4, 'COMMERCIAL', 5, '2025-08-20 10:00:00', '2025-10-15 09:00:00');
INSERT INTO case_transitions (case_id, from_status_id, to_status_id, transitioned_at, transitioned_by) VALUES
(4, NULL, 1, '2025-08-20 10:00:00', 'system'),
(4, 1, 2, '2025-08-21 08:30:00', 'analyst1@bank.com'),
(4, 2, 3, '2025-08-28 14:00:00', 'analyst1@bank.com'),
(4, 3, 2, '2025-09-05 10:00:00', 'analyst1@bank.com'),
(4, 2, 3, '2025-09-12 11:30:00', 'analyst1@bank.com'),
(4, 3, 2, '2025-09-20 09:00:00', 'analyst1@bank.com'),
(4, 2, 4, '2025-10-08 16:00:00', 'analyst1@bank.com'),
(4, 4, 5, '2025-10-15 09:00:00', 'senior1@bank.com');

-- Case 5: Sanctions, Singapore, Retail
INSERT INTO investigation_cases (case_reference, case_type_id, country_id, line_of_business, current_status_id, created_at, updated_at) VALUES
('FC-2025-0005', 5, 5, 'RETAIL', 5, '2025-09-10 06:00:00', '2025-09-25 12:00:00');
INSERT INTO case_transitions (case_id, from_status_id, to_status_id, transitioned_at, transitioned_by) VALUES
(5, NULL, 1, '2025-09-10 06:00:00', 'system'),
(5, 1, 2, '2025-09-10 09:00:00', 'analyst2@bank.com'),
(5, 2, 4, '2025-09-22 14:00:00', 'analyst2@bank.com'),
(5, 4, 5, '2025-09-25 12:00:00', 'senior2@bank.com');

-- Case 6: SAR, Hong Kong, Commercial
INSERT INTO investigation_cases (case_reference, case_type_id, country_id, line_of_business, current_status_id, created_at, updated_at) VALUES
('FC-2025-0006', 1, 6, 'COMMERCIAL', 5, '2025-07-01 03:00:00', '2025-08-05 10:00:00');
INSERT INTO case_transitions (case_id, from_status_id, to_status_id, transitioned_at, transitioned_by) VALUES
(6, NULL, 1, '2025-07-01 03:00:00', 'system'),
(6, 1, 2, '2025-07-02 04:30:00', 'analyst3@bank.com'),
(6, 2, 3, '2025-07-10 08:00:00', 'analyst3@bank.com'),
(6, 3, 2, '2025-07-18 06:00:00', 'analyst3@bank.com'),
(6, 2, 4, '2025-07-30 09:00:00', 'analyst3@bank.com'),
(6, 4, 5, '2025-08-05 10:00:00', 'senior1@bank.com');

-- Case 7: TM Alert, Australia, Retail
INSERT INTO investigation_cases (case_reference, case_type_id, country_id, line_of_business, current_status_id, created_at, updated_at) VALUES
('FC-2025-0007', 2, 7, 'RETAIL', 5, '2025-08-01 01:00:00', '2025-08-20 05:00:00');
INSERT INTO case_transitions (case_id, from_status_id, to_status_id, transitioned_at, transitioned_by) VALUES
(7, NULL, 1, '2025-08-01 01:00:00', 'system'),
(7, 1, 2, '2025-08-02 02:00:00', 'analyst1@bank.com'),
(7, 2, 4, '2025-08-16 04:00:00', 'analyst1@bank.com'),
(7, 4, 5, '2025-08-20 05:00:00', 'senior2@bank.com');

-- Case 8: KYC, UK, Commercial - with awaiting info
INSERT INTO investigation_cases (case_reference, case_type_id, country_id, line_of_business, current_status_id, created_at, updated_at) VALUES
('FC-2025-0008', 3, 1, 'COMMERCIAL', 5, '2025-07-15 09:00:00', '2025-08-25 14:00:00');
INSERT INTO case_transitions (case_id, from_status_id, to_status_id, transitioned_at, transitioned_by) VALUES
(8, NULL, 1, '2025-07-15 09:00:00', 'system'),
(8, 1, 2, '2025-07-16 10:30:00', 'analyst2@bank.com'),
(8, 2, 3, '2025-07-25 11:00:00', 'analyst2@bank.com'),
(8, 3, 2, '2025-08-02 09:00:00', 'analyst2@bank.com'),
(8, 2, 4, '2025-08-18 15:00:00', 'analyst2@bank.com'),
(8, 4, 5, '2025-08-25 14:00:00', 'senior1@bank.com');

-- Case 9: Fraud, USA, Retail
INSERT INTO investigation_cases (case_reference, case_type_id, country_id, line_of_business, current_status_id, created_at, updated_at) VALUES
('FC-2025-0009', 4, 2, 'RETAIL', 5, '2025-09-05 13:00:00', '2025-10-01 10:00:00');
INSERT INTO case_transitions (case_id, from_status_id, to_status_id, transitioned_at, transitioned_by) VALUES
(9, NULL, 1, '2025-09-05 13:00:00', 'system'),
(9, 1, 2, '2025-09-06 09:00:00', 'analyst3@bank.com'),
(9, 2, 4, '2025-09-25 11:00:00', 'analyst3@bank.com'),
(9, 4, 5, '2025-10-01 10:00:00', 'senior2@bank.com');

-- Case 10: Sanctions, Germany, Commercial
INSERT INTO investigation_cases (case_reference, case_type_id, country_id, line_of_business, current_status_id, created_at, updated_at) VALUES
('FC-2025-0010', 5, 3, 'COMMERCIAL', 5, '2025-08-10 07:00:00', '2025-09-15 16:00:00');
INSERT INTO case_transitions (case_id, from_status_id, to_status_id, transitioned_at, transitioned_by) VALUES
(10, NULL, 1, '2025-08-10 07:00:00', 'system'),
(10, 1, 2, '2025-08-11 08:00:00', 'analyst1@bank.com'),
(10, 2, 3, '2025-08-20 10:00:00', 'analyst1@bank.com'),
(10, 3, 2, '2025-08-28 09:00:00', 'analyst1@bank.com'),
(10, 2, 4, '2025-09-10 14:00:00', 'analyst1@bank.com'),
(10, 4, 5, '2025-09-15 16:00:00', 'senior1@bank.com');

-- Case 11-20: More CLOSED cases
INSERT INTO investigation_cases (case_reference, case_type_id, country_id, line_of_business, current_status_id, created_at, updated_at) VALUES
('FC-2025-0011', 1, 2, 'RETAIL', 5, '2025-06-01 08:00:00', '2025-06-20 14:00:00'),
('FC-2025-0012', 2, 1, 'COMMERCIAL', 5, '2025-06-05 09:00:00', '2025-07-10 11:00:00'),
('FC-2025-0013', 3, 4, 'RETAIL', 5, '2025-06-10 10:00:00', '2025-07-05 16:00:00'),
('FC-2025-0014', 4, 5, 'COMMERCIAL', 5, '2025-06-15 07:00:00', '2025-07-25 09:00:00'),
('FC-2025-0015', 5, 6, 'RETAIL', 5, '2025-06-20 11:00:00', '2025-07-15 13:00:00'),
('FC-2025-0016', 1, 7, 'COMMERCIAL', 5, '2025-07-01 08:00:00', '2025-07-28 15:00:00'),
('FC-2025-0017', 2, 3, 'RETAIL', 5, '2025-07-05 09:00:00', '2025-07-30 10:00:00'),
('FC-2025-0018', 3, 2, 'COMMERCIAL', 5, '2025-07-10 10:00:00', '2025-08-08 14:00:00'),
('FC-2025-0019', 4, 1, 'RETAIL', 5, '2025-07-15 11:00:00', '2025-08-15 16:00:00'),
('FC-2025-0020', 5, 4, 'COMMERCIAL', 5, '2025-07-20 07:00:00', '2025-08-20 09:00:00');

-- Transitions for cases 11-20 (straightforward paths)
INSERT INTO case_transitions (case_id, from_status_id, to_status_id, transitioned_at, transitioned_by) VALUES
(11, NULL, 1, '2025-06-01 08:00:00', 'system'), (11, 1, 2, '2025-06-02 09:00:00', 'analyst1@bank.com'), (11, 2, 4, '2025-06-16 14:00:00', 'analyst1@bank.com'), (11, 4, 5, '2025-06-20 14:00:00', 'senior1@bank.com'),
(12, NULL, 1, '2025-06-05 09:00:00', 'system'), (12, 1, 2, '2025-06-06 10:00:00', 'analyst2@bank.com'), (12, 2, 3, '2025-06-15 11:00:00', 'analyst2@bank.com'), (12, 3, 2, '2025-06-25 09:00:00', 'analyst2@bank.com'), (12, 2, 4, '2025-07-05 14:00:00', 'analyst2@bank.com'), (12, 4, 5, '2025-07-10 11:00:00', 'senior2@bank.com'),
(13, NULL, 1, '2025-06-10 10:00:00', 'system'), (13, 1, 2, '2025-06-11 09:00:00', 'analyst3@bank.com'), (13, 2, 4, '2025-06-30 15:00:00', 'analyst3@bank.com'), (13, 4, 5, '2025-07-05 16:00:00', 'senior1@bank.com'),
(14, NULL, 1, '2025-06-15 07:00:00', 'system'), (14, 1, 2, '2025-06-16 08:00:00', 'analyst1@bank.com'), (14, 2, 3, '2025-06-25 10:00:00', 'analyst1@bank.com'), (14, 3, 2, '2025-07-05 09:00:00', 'analyst1@bank.com'), (14, 2, 3, '2025-07-10 11:00:00', 'analyst1@bank.com'), (14, 3, 2, '2025-07-15 10:00:00', 'analyst1@bank.com'), (14, 2, 4, '2025-07-20 14:00:00', 'analyst1@bank.com'), (14, 4, 5, '2025-07-25 09:00:00', 'senior2@bank.com'),
(15, NULL, 1, '2025-06-20 11:00:00', 'system'), (15, 1, 2, '2025-06-21 04:00:00', 'analyst2@bank.com'), (15, 2, 4, '2025-07-10 08:00:00', 'analyst2@bank.com'), (15, 4, 5, '2025-07-15 13:00:00', 'senior1@bank.com'),
(16, NULL, 1, '2025-07-01 08:00:00', 'system'), (16, 1, 2, '2025-07-02 02:00:00', 'analyst3@bank.com'), (16, 2, 3, '2025-07-10 05:00:00', 'analyst3@bank.com'), (16, 3, 2, '2025-07-18 03:00:00', 'analyst3@bank.com'), (16, 2, 4, '2025-07-25 06:00:00', 'analyst3@bank.com'), (16, 4, 5, '2025-07-28 15:00:00', 'senior2@bank.com'),
(17, NULL, 1, '2025-07-05 09:00:00', 'system'), (17, 1, 2, '2025-07-06 08:00:00', 'analyst1@bank.com'), (17, 2, 4, '2025-07-25 11:00:00', 'analyst1@bank.com'), (17, 4, 5, '2025-07-30 10:00:00', 'senior1@bank.com'),
(18, NULL, 1, '2025-07-10 10:00:00', 'system'), (18, 1, 2, '2025-07-11 09:00:00', 'analyst2@bank.com'), (18, 2, 3, '2025-07-20 14:00:00', 'analyst2@bank.com'), (18, 3, 2, '2025-07-28 10:00:00', 'analyst2@bank.com'), (18, 2, 4, '2025-08-05 11:00:00', 'analyst2@bank.com'), (18, 4, 5, '2025-08-08 14:00:00', 'senior2@bank.com'),
(19, NULL, 1, '2025-07-15 11:00:00', 'system'), (19, 1, 2, '2025-07-16 10:00:00', 'analyst3@bank.com'), (19, 2, 4, '2025-08-10 15:00:00', 'analyst3@bank.com'), (19, 4, 5, '2025-08-15 16:00:00', 'senior1@bank.com'),
(20, NULL, 1, '2025-07-20 07:00:00', 'system'), (20, 1, 2, '2025-07-21 08:00:00', 'analyst1@bank.com'), (20, 2, 3, '2025-08-01 10:00:00', 'analyst1@bank.com'), (20, 3, 2, '2025-08-10 09:00:00', 'analyst1@bank.com'), (20, 2, 4, '2025-08-16 14:00:00', 'analyst1@bank.com'), (20, 4, 5, '2025-08-20 09:00:00', 'senior2@bank.com');

-- Cases 21-40: More CLOSED cases with varied patterns
INSERT INTO investigation_cases (case_reference, case_type_id, country_id, line_of_business, current_status_id, created_at, updated_at) VALUES
('FC-2025-0021', 1, 1, 'COMMERCIAL', 5, '2025-05-01 08:00:00', '2025-05-28 14:00:00'),
('FC-2025-0022', 2, 2, 'RETAIL', 5, '2025-05-05 09:00:00', '2025-06-02 11:00:00'),
('FC-2025-0023', 3, 3, 'COMMERCIAL', 5, '2025-05-10 10:00:00', '2025-06-08 16:00:00'),
('FC-2025-0024', 4, 4, 'RETAIL', 5, '2025-05-15 07:00:00', '2025-06-15 09:00:00'),
('FC-2025-0025', 5, 5, 'COMMERCIAL', 5, '2025-05-20 11:00:00', '2025-06-20 13:00:00'),
('FC-2025-0026', 1, 6, 'RETAIL', 5, '2025-05-25 08:00:00', '2025-06-25 15:00:00'),
('FC-2025-0027', 2, 7, 'COMMERCIAL', 5, '2025-06-01 09:00:00', '2025-07-01 10:00:00'),
('FC-2025-0028', 3, 1, 'RETAIL', 5, '2025-06-05 10:00:00', '2025-07-05 14:00:00'),
('FC-2025-0029', 4, 2, 'COMMERCIAL', 5, '2025-06-10 11:00:00', '2025-07-10 16:00:00'),
('FC-2025-0030', 5, 3, 'RETAIL', 5, '2025-06-15 07:00:00', '2025-07-15 09:00:00'),
('FC-2025-0031', 1, 4, 'COMMERCIAL', 5, '2025-04-01 08:00:00', '2025-05-01 14:00:00'),
('FC-2025-0032', 2, 5, 'RETAIL', 5, '2025-04-05 09:00:00', '2025-05-05 11:00:00'),
('FC-2025-0033', 3, 6, 'COMMERCIAL', 5, '2025-04-10 10:00:00', '2025-05-10 16:00:00'),
('FC-2025-0034', 4, 7, 'RETAIL', 5, '2025-04-15 07:00:00', '2025-05-15 09:00:00'),
('FC-2025-0035', 5, 1, 'COMMERCIAL', 5, '2025-04-20 11:00:00', '2025-05-20 13:00:00'),
('FC-2025-0036', 1, 2, 'RETAIL', 5, '2025-04-25 08:00:00', '2025-05-25 15:00:00'),
('FC-2025-0037', 2, 3, 'COMMERCIAL', 5, '2025-03-01 09:00:00', '2025-04-01 10:00:00'),
('FC-2025-0038', 3, 4, 'RETAIL', 5, '2025-03-05 10:00:00', '2025-04-05 14:00:00'),
('FC-2025-0039', 4, 5, 'COMMERCIAL', 5, '2025-03-10 11:00:00', '2025-04-10 16:00:00'),
('FC-2025-0040', 5, 6, 'RETAIL', 5, '2025-03-15 07:00:00', '2025-04-15 09:00:00');

INSERT INTO case_transitions (case_id, from_status_id, to_status_id, transitioned_at, transitioned_by) VALUES
(21, NULL, 1, '2025-05-01 08:00:00', 'system'), (21, 1, 2, '2025-05-02 09:00:00', 'analyst1@bank.com'), (21, 2, 4, '2025-05-22 14:00:00', 'analyst1@bank.com'), (21, 4, 5, '2025-05-28 14:00:00', 'senior1@bank.com'),
(22, NULL, 1, '2025-05-05 09:00:00', 'system'), (22, 1, 2, '2025-05-06 10:00:00', 'analyst2@bank.com'), (22, 2, 3, '2025-05-15 11:00:00', 'analyst2@bank.com'), (22, 3, 2, '2025-05-22 09:00:00', 'analyst2@bank.com'), (22, 2, 4, '2025-05-30 14:00:00', 'analyst2@bank.com'), (22, 4, 5, '2025-06-02 11:00:00', 'senior2@bank.com'),
(23, NULL, 1, '2025-05-10 10:00:00', 'system'), (23, 1, 2, '2025-05-11 09:00:00', 'analyst3@bank.com'), (23, 2, 4, '2025-06-02 15:00:00', 'analyst3@bank.com'), (23, 4, 5, '2025-06-08 16:00:00', 'senior1@bank.com'),
(24, NULL, 1, '2025-05-15 07:00:00', 'system'), (24, 1, 2, '2025-05-16 08:00:00', 'analyst1@bank.com'), (24, 2, 3, '2025-05-25 10:00:00', 'analyst1@bank.com'), (24, 3, 2, '2025-06-02 09:00:00', 'analyst1@bank.com'), (24, 2, 4, '2025-06-10 14:00:00', 'analyst1@bank.com'), (24, 4, 5, '2025-06-15 09:00:00', 'senior2@bank.com'),
(25, NULL, 1, '2025-05-20 11:00:00', 'system'), (25, 1, 2, '2025-05-21 06:00:00', 'analyst2@bank.com'), (25, 2, 4, '2025-06-15 08:00:00', 'analyst2@bank.com'), (25, 4, 5, '2025-06-20 13:00:00', 'senior1@bank.com'),
(26, NULL, 1, '2025-05-25 08:00:00', 'system'), (26, 1, 2, '2025-05-26 04:00:00', 'analyst3@bank.com'), (26, 2, 3, '2025-06-05 06:00:00', 'analyst3@bank.com'), (26, 3, 2, '2025-06-12 05:00:00', 'analyst3@bank.com'), (26, 2, 4, '2025-06-20 08:00:00', 'analyst3@bank.com'), (26, 4, 5, '2025-06-25 15:00:00', 'senior2@bank.com'),
(27, NULL, 1, '2025-06-01 09:00:00', 'system'), (27, 1, 2, '2025-06-02 02:00:00', 'analyst1@bank.com'), (27, 2, 4, '2025-06-25 04:00:00', 'analyst1@bank.com'), (27, 4, 5, '2025-07-01 10:00:00', 'senior1@bank.com'),
(28, NULL, 1, '2025-06-05 10:00:00', 'system'), (28, 1, 2, '2025-06-06 09:00:00', 'analyst2@bank.com'), (28, 2, 3, '2025-06-15 11:00:00', 'analyst2@bank.com'), (28, 3, 2, '2025-06-22 10:00:00', 'analyst2@bank.com'), (28, 2, 4, '2025-07-01 14:00:00', 'analyst2@bank.com'), (28, 4, 5, '2025-07-05 14:00:00', 'senior2@bank.com'),
(29, NULL, 1, '2025-06-10 11:00:00', 'system'), (29, 1, 2, '2025-06-11 10:00:00', 'analyst3@bank.com'), (29, 2, 4, '2025-07-02 15:00:00', 'analyst3@bank.com'), (29, 4, 5, '2025-07-10 16:00:00', 'senior1@bank.com'),
(30, NULL, 1, '2025-06-15 07:00:00', 'system'), (30, 1, 2, '2025-06-16 08:00:00', 'analyst1@bank.com'), (30, 2, 3, '2025-06-25 10:00:00', 'analyst1@bank.com'), (30, 3, 2, '2025-07-02 09:00:00', 'analyst1@bank.com'), (30, 2, 4, '2025-07-10 14:00:00', 'analyst1@bank.com'), (30, 4, 5, '2025-07-15 09:00:00', 'senior2@bank.com'),
(31, NULL, 1, '2025-04-01 08:00:00', 'system'), (31, 1, 2, '2025-04-02 09:00:00', 'analyst2@bank.com'), (31, 2, 4, '2025-04-25 14:00:00', 'analyst2@bank.com'), (31, 4, 5, '2025-05-01 14:00:00', 'senior1@bank.com'),
(32, NULL, 1, '2025-04-05 09:00:00', 'system'), (32, 1, 2, '2025-04-06 06:00:00', 'analyst3@bank.com'), (32, 2, 4, '2025-04-28 08:00:00', 'analyst3@bank.com'), (32, 4, 5, '2025-05-05 11:00:00', 'senior2@bank.com'),
(33, NULL, 1, '2025-04-10 10:00:00', 'system'), (33, 1, 2, '2025-04-11 04:00:00', 'analyst1@bank.com'), (33, 2, 3, '2025-04-20 06:00:00', 'analyst1@bank.com'), (33, 3, 2, '2025-04-28 05:00:00', 'analyst1@bank.com'), (33, 2, 4, '2025-05-05 08:00:00', 'analyst1@bank.com'), (33, 4, 5, '2025-05-10 16:00:00', 'senior1@bank.com'),
(34, NULL, 1, '2025-04-15 07:00:00', 'system'), (34, 1, 2, '2025-04-16 02:00:00', 'analyst2@bank.com'), (34, 2, 4, '2025-05-08 04:00:00', 'analyst2@bank.com'), (34, 4, 5, '2025-05-15 09:00:00', 'senior2@bank.com'),
(35, NULL, 1, '2025-04-20 11:00:00', 'system'), (35, 1, 2, '2025-04-21 09:00:00', 'analyst3@bank.com'), (35, 2, 3, '2025-05-01 10:00:00', 'analyst3@bank.com'), (35, 3, 2, '2025-05-08 09:00:00', 'analyst3@bank.com'), (35, 2, 4, '2025-05-15 14:00:00', 'analyst3@bank.com'), (35, 4, 5, '2025-05-20 13:00:00', 'senior1@bank.com'),
(36, NULL, 1, '2025-04-25 08:00:00', 'system'), (36, 1, 2, '2025-04-26 09:00:00', 'analyst1@bank.com'), (36, 2, 4, '2025-05-18 14:00:00', 'analyst1@bank.com'), (36, 4, 5, '2025-05-25 15:00:00', 'senior2@bank.com'),
(37, NULL, 1, '2025-03-01 09:00:00', 'system'), (37, 1, 2, '2025-03-02 08:00:00', 'analyst2@bank.com'), (37, 2, 3, '2025-03-12 11:00:00', 'analyst2@bank.com'), (37, 3, 2, '2025-03-20 09:00:00', 'analyst2@bank.com'), (37, 2, 4, '2025-03-28 14:00:00', 'analyst2@bank.com'), (37, 4, 5, '2025-04-01 10:00:00', 'senior1@bank.com'),
(38, NULL, 1, '2025-03-05 10:00:00', 'system'), (38, 1, 2, '2025-03-06 09:00:00', 'analyst3@bank.com'), (38, 2, 4, '2025-03-28 15:00:00', 'analyst3@bank.com'), (38, 4, 5, '2025-04-05 14:00:00', 'senior2@bank.com'),
(39, NULL, 1, '2025-03-10 11:00:00', 'system'), (39, 1, 2, '2025-03-11 06:00:00', 'analyst1@bank.com'), (39, 2, 3, '2025-03-20 08:00:00', 'analyst1@bank.com'), (39, 3, 2, '2025-03-28 07:00:00', 'analyst1@bank.com'), (39, 2, 4, '2025-04-05 10:00:00', 'analyst1@bank.com'), (39, 4, 5, '2025-04-10 16:00:00', 'senior1@bank.com'),
(40, NULL, 1, '2025-03-15 07:00:00', 'system'), (40, 1, 2, '2025-03-16 04:00:00', 'analyst2@bank.com'), (40, 2, 4, '2025-04-08 06:00:00', 'analyst2@bank.com'), (40, 4, 5, '2025-04-15 09:00:00', 'senior2@bank.com');

-- =============================================
-- REVIEW CASES (20 cases) - In review stage
-- =============================================
INSERT INTO investigation_cases (case_reference, case_type_id, country_id, line_of_business, current_status_id, created_at, updated_at) VALUES
('FC-2025-0041', 1, 1, 'RETAIL', 4, '2025-10-01 08:00:00', '2025-10-20 14:00:00'),
('FC-2025-0042', 2, 2, 'COMMERCIAL', 4, '2025-10-02 09:00:00', '2025-10-22 11:00:00'),
('FC-2025-0043', 3, 3, 'RETAIL', 4, '2025-10-03 10:00:00', '2025-10-21 16:00:00'),
('FC-2025-0044', 4, 4, 'COMMERCIAL', 4, '2025-09-20 07:00:00', '2025-10-18 09:00:00'),
('FC-2025-0045', 5, 5, 'RETAIL', 4, '2025-09-25 11:00:00', '2025-10-20 13:00:00'),
('FC-2025-0046', 1, 6, 'COMMERCIAL', 4, '2025-10-01 03:00:00', '2025-10-19 05:00:00'),
('FC-2025-0047', 2, 7, 'RETAIL', 4, '2025-10-05 01:00:00', '2025-10-22 03:00:00'),
('FC-2025-0048', 3, 1, 'COMMERCIAL', 4, '2025-09-28 09:00:00', '2025-10-21 11:00:00'),
('FC-2025-0049', 4, 2, 'RETAIL', 4, '2025-10-01 13:00:00', '2025-10-20 10:00:00'),
('FC-2025-0050', 5, 3, 'COMMERCIAL', 4, '2025-09-25 07:00:00', '2025-10-19 16:00:00'),
('FC-2025-0051', 1, 4, 'RETAIL', 4, '2025-10-03 08:00:00', '2025-10-23 14:00:00'),
('FC-2025-0052', 2, 5, 'COMMERCIAL', 4, '2025-10-01 06:00:00', '2025-10-21 08:00:00'),
('FC-2025-0053', 3, 6, 'RETAIL', 4, '2025-09-28 04:00:00', '2025-10-20 06:00:00'),
('FC-2025-0054', 4, 7, 'COMMERCIAL', 4, '2025-10-02 02:00:00', '2025-10-22 04:00:00'),
('FC-2025-0055', 5, 1, 'RETAIL', 4, '2025-09-30 09:00:00', '2025-10-21 11:00:00'),
('FC-2025-0056', 1, 2, 'COMMERCIAL', 4, '2025-10-04 10:00:00', '2025-10-23 12:00:00'),
('FC-2025-0057', 2, 3, 'RETAIL', 4, '2025-09-29 08:00:00', '2025-10-20 10:00:00'),
('FC-2025-0058', 3, 4, 'COMMERCIAL', 4, '2025-10-01 07:00:00', '2025-10-22 09:00:00'),
('FC-2025-0059', 4, 5, 'RETAIL', 4, '2025-10-03 06:00:00', '2025-10-23 08:00:00'),
('FC-2025-0060', 5, 6, 'COMMERCIAL', 4, '2025-09-27 03:00:00', '2025-10-19 05:00:00');

INSERT INTO case_transitions (case_id, from_status_id, to_status_id, transitioned_at, transitioned_by) VALUES
(41, NULL, 1, '2025-10-01 08:00:00', 'system'), (41, 1, 2, '2025-10-02 09:00:00', 'analyst1@bank.com'), (41, 2, 4, '2025-10-20 14:00:00', 'analyst1@bank.com'),
(42, NULL, 1, '2025-10-02 09:00:00', 'system'), (42, 1, 2, '2025-10-03 10:00:00', 'analyst2@bank.com'), (42, 2, 3, '2025-10-10 11:00:00', 'analyst2@bank.com'), (42, 3, 2, '2025-10-15 09:00:00', 'analyst2@bank.com'), (42, 2, 4, '2025-10-22 11:00:00', 'analyst2@bank.com'),
(43, NULL, 1, '2025-10-03 10:00:00', 'system'), (43, 1, 2, '2025-10-04 09:00:00', 'analyst3@bank.com'), (43, 2, 4, '2025-10-21 16:00:00', 'analyst3@bank.com'),
(44, NULL, 1, '2025-09-20 07:00:00', 'system'), (44, 1, 2, '2025-09-21 08:00:00', 'analyst1@bank.com'), (44, 2, 3, '2025-09-30 10:00:00', 'analyst1@bank.com'), (44, 3, 2, '2025-10-08 09:00:00', 'analyst1@bank.com'), (44, 2, 4, '2025-10-18 09:00:00', 'analyst1@bank.com'),
(45, NULL, 1, '2025-09-25 11:00:00', 'system'), (45, 1, 2, '2025-09-26 06:00:00', 'analyst2@bank.com'), (45, 2, 4, '2025-10-20 13:00:00', 'analyst2@bank.com'),
(46, NULL, 1, '2025-10-01 03:00:00', 'system'), (46, 1, 2, '2025-10-02 04:00:00', 'analyst3@bank.com'), (46, 2, 4, '2025-10-19 05:00:00', 'analyst3@bank.com'),
(47, NULL, 1, '2025-10-05 01:00:00', 'system'), (47, 1, 2, '2025-10-06 02:00:00', 'analyst1@bank.com'), (47, 2, 3, '2025-10-12 03:00:00', 'analyst1@bank.com'), (47, 3, 2, '2025-10-17 02:00:00', 'analyst1@bank.com'), (47, 2, 4, '2025-10-22 03:00:00', 'analyst1@bank.com'),
(48, NULL, 1, '2025-09-28 09:00:00', 'system'), (48, 1, 2, '2025-09-29 10:00:00', 'analyst2@bank.com'), (48, 2, 3, '2025-10-08 11:00:00', 'analyst2@bank.com'), (48, 3, 2, '2025-10-15 10:00:00', 'analyst2@bank.com'), (48, 2, 4, '2025-10-21 11:00:00', 'analyst2@bank.com'),
(49, NULL, 1, '2025-10-01 13:00:00', 'system'), (49, 1, 2, '2025-10-02 09:00:00', 'analyst3@bank.com'), (49, 2, 4, '2025-10-20 10:00:00', 'analyst3@bank.com'),
(50, NULL, 1, '2025-09-25 07:00:00', 'system'), (50, 1, 2, '2025-09-26 08:00:00', 'analyst1@bank.com'), (50, 2, 3, '2025-10-05 10:00:00', 'analyst1@bank.com'), (50, 3, 2, '2025-10-12 09:00:00', 'analyst1@bank.com'), (50, 2, 4, '2025-10-19 16:00:00', 'analyst1@bank.com'),
(51, NULL, 1, '2025-10-03 08:00:00', 'system'), (51, 1, 2, '2025-10-04 09:00:00', 'analyst2@bank.com'), (51, 2, 4, '2025-10-23 14:00:00', 'analyst2@bank.com'),
(52, NULL, 1, '2025-10-01 06:00:00', 'system'), (52, 1, 2, '2025-10-02 07:00:00', 'analyst3@bank.com'), (52, 2, 4, '2025-10-21 08:00:00', 'analyst3@bank.com'),
(53, NULL, 1, '2025-09-28 04:00:00', 'system'), (53, 1, 2, '2025-09-29 05:00:00', 'analyst1@bank.com'), (53, 2, 3, '2025-10-08 06:00:00', 'analyst1@bank.com'), (53, 3, 2, '2025-10-15 05:00:00', 'analyst1@bank.com'), (53, 2, 4, '2025-10-20 06:00:00', 'analyst1@bank.com'),
(54, NULL, 1, '2025-10-02 02:00:00', 'system'), (54, 1, 2, '2025-10-03 03:00:00', 'analyst2@bank.com'), (54, 2, 4, '2025-10-22 04:00:00', 'analyst2@bank.com'),
(55, NULL, 1, '2025-09-30 09:00:00', 'system'), (55, 1, 2, '2025-10-01 10:00:00', 'analyst3@bank.com'), (55, 2, 3, '2025-10-10 11:00:00', 'analyst3@bank.com'), (55, 3, 2, '2025-10-16 10:00:00', 'analyst3@bank.com'), (55, 2, 4, '2025-10-21 11:00:00', 'analyst3@bank.com'),
(56, NULL, 1, '2025-10-04 10:00:00', 'system'), (56, 1, 2, '2025-10-05 11:00:00', 'analyst1@bank.com'), (56, 2, 4, '2025-10-23 12:00:00', 'analyst1@bank.com'),
(57, NULL, 1, '2025-09-29 08:00:00', 'system'), (57, 1, 2, '2025-09-30 09:00:00', 'analyst2@bank.com'), (57, 2, 4, '2025-10-20 10:00:00', 'analyst2@bank.com'),
(58, NULL, 1, '2025-10-01 07:00:00', 'system'), (58, 1, 2, '2025-10-02 08:00:00', 'analyst3@bank.com'), (58, 2, 3, '2025-10-10 09:00:00', 'analyst3@bank.com'), (58, 3, 2, '2025-10-16 08:00:00', 'analyst3@bank.com'), (58, 2, 4, '2025-10-22 09:00:00', 'analyst3@bank.com'),
(59, NULL, 1, '2025-10-03 06:00:00', 'system'), (59, 1, 2, '2025-10-04 07:00:00', 'analyst1@bank.com'), (59, 2, 4, '2025-10-23 08:00:00', 'analyst1@bank.com'),
(60, NULL, 1, '2025-09-27 03:00:00', 'system'), (60, 1, 2, '2025-09-28 04:00:00', 'analyst2@bank.com'), (60, 2, 3, '2025-10-05 05:00:00', 'analyst2@bank.com'), (60, 3, 2, '2025-10-12 04:00:00', 'analyst2@bank.com'), (60, 2, 4, '2025-10-19 05:00:00', 'analyst2@bank.com');

-- =============================================
-- UNDER INVESTIGATION (25 cases)
-- =============================================
INSERT INTO investigation_cases (case_reference, case_type_id, country_id, line_of_business, current_status_id, created_at, updated_at) VALUES
('FC-2025-0061', 1, 1, 'RETAIL', 2, '2025-10-15 08:00:00', '2025-10-16 09:00:00'),
('FC-2025-0062', 2, 2, 'COMMERCIAL', 2, '2025-10-14 09:00:00', '2025-10-15 10:00:00'),
('FC-2025-0063', 3, 3, 'RETAIL', 2, '2025-10-13 10:00:00', '2025-10-14 09:00:00'),
('FC-2025-0064', 4, 4, 'COMMERCIAL', 2, '2025-10-12 07:00:00', '2025-10-13 08:00:00'),
('FC-2025-0065', 5, 5, 'RETAIL', 2, '2025-10-11 11:00:00', '2025-10-12 06:00:00'),
('FC-2025-0066', 1, 6, 'COMMERCIAL', 2, '2025-10-10 03:00:00', '2025-10-11 04:00:00'),
('FC-2025-0067', 2, 7, 'RETAIL', 2, '2025-10-09 01:00:00', '2025-10-10 02:00:00'),
('FC-2025-0068', 3, 1, 'COMMERCIAL', 2, '2025-10-08 09:00:00', '2025-10-09 10:00:00'),
('FC-2025-0069', 4, 2, 'RETAIL', 2, '2025-10-07 13:00:00', '2025-10-08 09:00:00'),
('FC-2025-0070', 5, 3, 'COMMERCIAL', 2, '2025-10-06 07:00:00', '2025-10-07 08:00:00'),
('FC-2025-0071', 1, 4, 'RETAIL', 2, '2025-10-16 08:00:00', '2025-10-17 09:00:00'),
('FC-2025-0072', 2, 5, 'COMMERCIAL', 2, '2025-10-15 06:00:00', '2025-10-16 07:00:00'),
('FC-2025-0073', 3, 6, 'RETAIL', 2, '2025-10-14 04:00:00', '2025-10-15 05:00:00'),
('FC-2025-0074', 4, 7, 'COMMERCIAL', 2, '2025-10-13 02:00:00', '2025-10-14 03:00:00'),
('FC-2025-0075', 5, 1, 'RETAIL', 2, '2025-10-12 09:00:00', '2025-10-13 10:00:00'),
('FC-2025-0076', 1, 2, 'COMMERCIAL', 2, '2025-10-11 10:00:00', '2025-10-12 11:00:00'),
('FC-2025-0077', 2, 3, 'RETAIL', 2, '2025-10-10 08:00:00', '2025-10-11 09:00:00'),
('FC-2025-0078', 3, 4, 'COMMERCIAL', 2, '2025-10-09 07:00:00', '2025-10-10 08:00:00'),
('FC-2025-0079', 4, 5, 'RETAIL', 2, '2025-10-08 06:00:00', '2025-10-09 07:00:00'),
('FC-2025-0080', 5, 6, 'COMMERCIAL', 2, '2025-10-07 03:00:00', '2025-10-08 04:00:00'),
('FC-2025-0081', 1, 7, 'RETAIL', 2, '2025-10-17 01:00:00', '2025-10-18 02:00:00'),
('FC-2025-0082', 2, 1, 'COMMERCIAL', 2, '2025-10-16 09:00:00', '2025-10-17 10:00:00'),
('FC-2025-0083', 3, 2, 'RETAIL', 2, '2025-10-15 10:00:00', '2025-10-16 09:00:00'),
('FC-2025-0084', 4, 3, 'COMMERCIAL', 2, '2025-10-14 08:00:00', '2025-10-15 09:00:00'),
('FC-2025-0085', 5, 4, 'RETAIL', 2, '2025-10-13 07:00:00', '2025-10-14 08:00:00');

INSERT INTO case_transitions (case_id, from_status_id, to_status_id, transitioned_at, transitioned_by) VALUES
(61, NULL, 1, '2025-10-15 08:00:00', 'system'), (61, 1, 2, '2025-10-16 09:00:00', 'analyst1@bank.com'),
(62, NULL, 1, '2025-10-14 09:00:00', 'system'), (62, 1, 2, '2025-10-15 10:00:00', 'analyst2@bank.com'),
(63, NULL, 1, '2025-10-13 10:00:00', 'system'), (63, 1, 2, '2025-10-14 09:00:00', 'analyst3@bank.com'),
(64, NULL, 1, '2025-10-12 07:00:00', 'system'), (64, 1, 2, '2025-10-13 08:00:00', 'analyst1@bank.com'),
(65, NULL, 1, '2025-10-11 11:00:00', 'system'), (65, 1, 2, '2025-10-12 06:00:00', 'analyst2@bank.com'),
(66, NULL, 1, '2025-10-10 03:00:00', 'system'), (66, 1, 2, '2025-10-11 04:00:00', 'analyst3@bank.com'),
(67, NULL, 1, '2025-10-09 01:00:00', 'system'), (67, 1, 2, '2025-10-10 02:00:00', 'analyst1@bank.com'),
(68, NULL, 1, '2025-10-08 09:00:00', 'system'), (68, 1, 2, '2025-10-09 10:00:00', 'analyst2@bank.com'),
(69, NULL, 1, '2025-10-07 13:00:00', 'system'), (69, 1, 2, '2025-10-08 09:00:00', 'analyst3@bank.com'),
(70, NULL, 1, '2025-10-06 07:00:00', 'system'), (70, 1, 2, '2025-10-07 08:00:00', 'analyst1@bank.com'),
(71, NULL, 1, '2025-10-16 08:00:00', 'system'), (71, 1, 2, '2025-10-17 09:00:00', 'analyst2@bank.com'),
(72, NULL, 1, '2025-10-15 06:00:00', 'system'), (72, 1, 2, '2025-10-16 07:00:00', 'analyst3@bank.com'),
(73, NULL, 1, '2025-10-14 04:00:00', 'system'), (73, 1, 2, '2025-10-15 05:00:00', 'analyst1@bank.com'),
(74, NULL, 1, '2025-10-13 02:00:00', 'system'), (74, 1, 2, '2025-10-14 03:00:00', 'analyst2@bank.com'),
(75, NULL, 1, '2025-10-12 09:00:00', 'system'), (75, 1, 2, '2025-10-13 10:00:00', 'analyst3@bank.com'),
(76, NULL, 1, '2025-10-11 10:00:00', 'system'), (76, 1, 2, '2025-10-12 11:00:00', 'analyst1@bank.com'),
(77, NULL, 1, '2025-10-10 08:00:00', 'system'), (77, 1, 2, '2025-10-11 09:00:00', 'analyst2@bank.com'),
(78, NULL, 1, '2025-10-09 07:00:00', 'system'), (78, 1, 2, '2025-10-10 08:00:00', 'analyst3@bank.com'),
(79, NULL, 1, '2025-10-08 06:00:00', 'system'), (79, 1, 2, '2025-10-09 07:00:00', 'analyst1@bank.com'),
(80, NULL, 1, '2025-10-07 03:00:00', 'system'), (80, 1, 2, '2025-10-08 04:00:00', 'analyst2@bank.com'),
(81, NULL, 1, '2025-10-17 01:00:00', 'system'), (81, 1, 2, '2025-10-18 02:00:00', 'analyst3@bank.com'),
(82, NULL, 1, '2025-10-16 09:00:00', 'system'), (82, 1, 2, '2025-10-17 10:00:00', 'analyst1@bank.com'),
(83, NULL, 1, '2025-10-15 10:00:00', 'system'), (83, 1, 2, '2025-10-16 09:00:00', 'analyst2@bank.com'),
(84, NULL, 1, '2025-10-14 08:00:00', 'system'), (84, 1, 2, '2025-10-15 09:00:00', 'analyst3@bank.com'),
(85, NULL, 1, '2025-10-13 07:00:00', 'system'), (85, 1, 2, '2025-10-14 08:00:00', 'analyst1@bank.com');

-- =============================================
-- AWAITING INFORMATION (10 cases) - went to AI from Under Investigation
-- =============================================
INSERT INTO investigation_cases (case_reference, case_type_id, country_id, line_of_business, current_status_id, created_at, updated_at) VALUES
('FC-2025-0086', 1, 1, 'RETAIL', 3, '2025-10-10 08:00:00', '2025-10-20 14:00:00'),
('FC-2025-0087', 2, 2, 'COMMERCIAL', 3, '2025-10-08 09:00:00', '2025-10-18 11:00:00'),
('FC-2025-0088', 3, 3, 'RETAIL', 3, '2025-10-09 10:00:00', '2025-10-19 16:00:00'),
('FC-2025-0089', 4, 4, 'COMMERCIAL', 3, '2025-10-07 07:00:00', '2025-10-17 09:00:00'),
('FC-2025-0090', 5, 5, 'RETAIL', 3, '2025-10-06 11:00:00', '2025-10-16 13:00:00'),
('FC-2025-0091', 1, 6, 'COMMERCIAL', 3, '2025-10-11 03:00:00', '2025-10-21 05:00:00'),
('FC-2025-0092', 2, 7, 'RETAIL', 3, '2025-10-05 01:00:00', '2025-10-15 03:00:00'),
('FC-2025-0093', 3, 1, 'COMMERCIAL', 3, '2025-10-12 09:00:00', '2025-10-22 11:00:00'),
('FC-2025-0094', 4, 2, 'RETAIL', 3, '2025-10-04 13:00:00', '2025-10-14 10:00:00'),
('FC-2025-0095', 5, 3, 'COMMERCIAL', 3, '2025-10-03 07:00:00', '2025-10-13 09:00:00');

INSERT INTO case_transitions (case_id, from_status_id, to_status_id, transitioned_at, transitioned_by) VALUES
(86, NULL, 1, '2025-10-10 08:00:00', 'system'), (86, 1, 2, '2025-10-11 09:00:00', 'analyst1@bank.com'), (86, 2, 3, '2025-10-20 14:00:00', 'analyst1@bank.com'),
(87, NULL, 1, '2025-10-08 09:00:00', 'system'), (87, 1, 2, '2025-10-09 10:00:00', 'analyst2@bank.com'), (87, 2, 3, '2025-10-18 11:00:00', 'analyst2@bank.com'),
(88, NULL, 1, '2025-10-09 10:00:00', 'system'), (88, 1, 2, '2025-10-10 09:00:00', 'analyst3@bank.com'), (88, 2, 3, '2025-10-19 16:00:00', 'analyst3@bank.com'),
(89, NULL, 1, '2025-10-07 07:00:00', 'system'), (89, 1, 2, '2025-10-08 08:00:00', 'analyst1@bank.com'), (89, 2, 3, '2025-10-17 09:00:00', 'analyst1@bank.com'),
(90, NULL, 1, '2025-10-06 11:00:00', 'system'), (90, 1, 2, '2025-10-07 06:00:00', 'analyst2@bank.com'), (90, 2, 3, '2025-10-16 13:00:00', 'analyst2@bank.com'),
(91, NULL, 1, '2025-10-11 03:00:00', 'system'), (91, 1, 2, '2025-10-12 04:00:00', 'analyst3@bank.com'), (91, 2, 3, '2025-10-21 05:00:00', 'analyst3@bank.com'),
(92, NULL, 1, '2025-10-05 01:00:00', 'system'), (92, 1, 2, '2025-10-06 02:00:00', 'analyst1@bank.com'), (92, 2, 3, '2025-10-15 03:00:00', 'analyst1@bank.com'),
(93, NULL, 1, '2025-10-12 09:00:00', 'system'), (93, 1, 2, '2025-10-13 10:00:00', 'analyst2@bank.com'), (93, 2, 3, '2025-10-22 11:00:00', 'analyst2@bank.com'),
(94, NULL, 1, '2025-10-04 13:00:00', 'system'), (94, 1, 2, '2025-10-05 09:00:00', 'analyst3@bank.com'), (94, 2, 3, '2025-10-14 10:00:00', 'analyst3@bank.com'),
(95, NULL, 1, '2025-10-03 07:00:00', 'system'), (95, 1, 2, '2025-10-04 08:00:00', 'analyst1@bank.com'), (95, 2, 3, '2025-10-13 09:00:00', 'analyst1@bank.com');

-- =============================================
-- NEW CASES (25 cases) - Just created
-- =============================================
INSERT INTO investigation_cases (case_reference, case_type_id, country_id, line_of_business, current_status_id, created_at, updated_at) VALUES
('FC-2025-0096', 1, 1, 'RETAIL', 1, '2025-10-23 08:00:00', '2025-10-23 08:00:00'),
('FC-2025-0097', 2, 2, 'COMMERCIAL', 1, '2025-10-23 09:00:00', '2025-10-23 09:00:00'),
('FC-2025-0098', 3, 3, 'RETAIL', 1, '2025-10-23 10:00:00', '2025-10-23 10:00:00'),
('FC-2025-0099', 4, 4, 'COMMERCIAL', 1, '2025-10-23 07:00:00', '2025-10-23 07:00:00'),
('FC-2025-0100', 5, 5, 'RETAIL', 1, '2025-10-23 11:00:00', '2025-10-23 11:00:00'),
('FC-2025-0101', 1, 6, 'COMMERCIAL', 1, '2025-10-23 03:00:00', '2025-10-23 03:00:00'),
('FC-2025-0102', 2, 7, 'RETAIL', 1, '2025-10-23 01:00:00', '2025-10-23 01:00:00'),
('FC-2025-0103', 3, 1, 'COMMERCIAL', 1, '2025-10-22 09:00:00', '2025-10-22 09:00:00'),
('FC-2025-0104', 4, 2, 'RETAIL', 1, '2025-10-22 13:00:00', '2025-10-22 13:00:00'),
('FC-2025-0105', 5, 3, 'COMMERCIAL', 1, '2025-10-22 07:00:00', '2025-10-22 07:00:00'),
('FC-2025-0106', 1, 4, 'RETAIL', 1, '2025-10-22 08:00:00', '2025-10-22 08:00:00'),
('FC-2025-0107', 2, 5, 'COMMERCIAL', 1, '2025-10-22 06:00:00', '2025-10-22 06:00:00'),
('FC-2025-0108', 3, 6, 'RETAIL', 1, '2025-10-22 04:00:00', '2025-10-22 04:00:00'),
('FC-2025-0109', 4, 7, 'COMMERCIAL', 1, '2025-10-22 02:00:00', '2025-10-22 02:00:00'),
('FC-2025-0110', 5, 1, 'RETAIL', 1, '2025-10-21 09:00:00', '2025-10-21 09:00:00'),
('FC-2025-0111', 1, 2, 'COMMERCIAL', 1, '2025-10-21 10:00:00', '2025-10-21 10:00:00'),
('FC-2025-0112', 2, 3, 'RETAIL', 1, '2025-10-21 08:00:00', '2025-10-21 08:00:00'),
('FC-2025-0113', 3, 4, 'COMMERCIAL', 1, '2025-10-21 07:00:00', '2025-10-21 07:00:00'),
('FC-2025-0114', 4, 5, 'RETAIL', 1, '2025-10-21 06:00:00', '2025-10-21 06:00:00'),
('FC-2025-0115', 5, 6, 'COMMERCIAL', 1, '2025-10-21 03:00:00', '2025-10-21 03:00:00'),
('FC-2025-0116', 1, 7, 'RETAIL', 1, '2025-10-20 01:00:00', '2025-10-20 01:00:00'),
('FC-2025-0117', 2, 1, 'COMMERCIAL', 1, '2025-10-20 09:00:00', '2025-10-20 09:00:00'),
('FC-2025-0118', 3, 2, 'RETAIL', 1, '2025-10-20 10:00:00', '2025-10-20 10:00:00'),
('FC-2025-0119', 4, 3, 'COMMERCIAL', 1, '2025-10-20 08:00:00', '2025-10-20 08:00:00'),
('FC-2025-0120', 5, 4, 'RETAIL', 1, '2025-10-20 07:00:00', '2025-10-20 07:00:00');

INSERT INTO case_transitions (case_id, from_status_id, to_status_id, transitioned_at, transitioned_by) VALUES
(96, NULL, 1, '2025-10-23 08:00:00', 'system'),
(97, NULL, 1, '2025-10-23 09:00:00', 'system'),
(98, NULL, 1, '2025-10-23 10:00:00', 'system'),
(99, NULL, 1, '2025-10-23 07:00:00', 'system'),
(100, NULL, 1, '2025-10-23 11:00:00', 'system'),
(101, NULL, 1, '2025-10-23 03:00:00', 'system'),
(102, NULL, 1, '2025-10-23 01:00:00', 'system'),
(103, NULL, 1, '2025-10-22 09:00:00', 'system'),
(104, NULL, 1, '2025-10-22 13:00:00', 'system'),
(105, NULL, 1, '2025-10-22 07:00:00', 'system'),
(106, NULL, 1, '2025-10-22 08:00:00', 'system'),
(107, NULL, 1, '2025-10-22 06:00:00', 'system'),
(108, NULL, 1, '2025-10-22 04:00:00', 'system'),
(109, NULL, 1, '2025-10-22 02:00:00', 'system'),
(110, NULL, 1, '2025-10-21 09:00:00', 'system'),
(111, NULL, 1, '2025-10-21 10:00:00', 'system'),
(112, NULL, 1, '2025-10-21 08:00:00', 'system'),
(113, NULL, 1, '2025-10-21 07:00:00', 'system'),
(114, NULL, 1, '2025-10-21 06:00:00', 'system'),
(115, NULL, 1, '2025-10-21 03:00:00', 'system'),
(116, NULL, 1, '2025-10-20 01:00:00', 'system'),
(117, NULL, 1, '2025-10-20 09:00:00', 'system'),
(118, NULL, 1, '2025-10-20 10:00:00', 'system'),
(119, NULL, 1, '2025-10-20 08:00:00', 'system'),
(120, NULL, 1, '2025-10-20 07:00:00', 'system');
