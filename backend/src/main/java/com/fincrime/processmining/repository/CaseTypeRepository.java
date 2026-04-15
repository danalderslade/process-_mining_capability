package com.fincrime.processmining.repository;

import com.fincrime.processmining.entity.CaseType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CaseTypeRepository extends JpaRepository<CaseType, Integer> {
}
