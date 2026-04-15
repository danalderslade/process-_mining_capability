-- V3: Adjust Under Investigation → Review transition times to demonstrate process improvement
-- Earlier months have longer investigation times, recent months show faster processing

-- Step 1: Scale the UI→Review (2→4) transition gap based on month
-- March: 18 days, April: 15d, May: 12d, Jun: 10d, Jul: 8d, Aug: 6d, Sep: 4d, Oct: 2.5d
-- Plus per-case variation of ±1 day based on case_id for realism
UPDATE case_transitions AS ct
SET transitioned_at = (
    SELECT MAX(prev.transitioned_at)
    FROM case_transitions prev
    WHERE prev.case_id = ct.case_id
    AND prev.to_status_id = 2
    AND prev.transitioned_at < ct.transitioned_at
) + CASE EXTRACT(MONTH FROM ct.transitioned_at)
    WHEN 3 THEN INTERVAL '432 hours'
    WHEN 4 THEN INTERVAL '360 hours'
    WHEN 5 THEN INTERVAL '288 hours'
    WHEN 6 THEN INTERVAL '240 hours'
    WHEN 7 THEN INTERVAL '192 hours'
    WHEN 8 THEN INTERVAL '144 hours'
    WHEN 9 THEN INTERVAL '96 hours'
    WHEN 10 THEN INTERVAL '60 hours'
    ELSE INTERVAL '240 hours'
  END + INTERVAL '1 hour' * (ct.case_id % 48 - 24)
WHERE ct.from_status_id = 2 AND ct.to_status_id = 4;

-- Step 2: Adjust Review→Closed (4→5) transitions to maintain ~4 day review period
UPDATE case_transitions AS ct5
SET transitioned_at = (
    SELECT ct4.transitioned_at + INTERVAL '96 hours' + INTERVAL '1 hour' * (ct5.case_id % 24)
    FROM case_transitions ct4
    WHERE ct4.case_id = ct5.case_id
    AND ct4.from_status_id = 2 AND ct4.to_status_id = 4
    ORDER BY ct4.transitioned_at DESC
    LIMIT 1
)
WHERE ct5.from_status_id = 4 AND ct5.to_status_id = 5;

-- Step 3: Update case timestamps to reflect adjusted transitions
UPDATE investigation_cases ic
SET updated_at = (
    SELECT MAX(ct.transitioned_at) FROM case_transitions ct WHERE ct.case_id = ic.id
);
