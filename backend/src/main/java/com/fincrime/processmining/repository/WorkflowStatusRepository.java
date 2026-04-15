package com.fincrime.processmining.repository;

import com.fincrime.processmining.entity.WorkflowStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkflowStatusRepository extends JpaRepository<WorkflowStatus, Integer> {
}
