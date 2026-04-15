package com.fincrime.processmining.repository;

import com.fincrime.processmining.entity.CaseTransition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CaseTransitionRepository extends JpaRepository<CaseTransition, Integer> {

    @Query("SELECT t FROM CaseTransition t " +
           "WHERE t.investigationCase.id = :caseId " +
           "ORDER BY t.transitionedAt")
    List<CaseTransition> findByCaseIdOrdered(@Param("caseId") Integer caseId);

    @Query(value = "SELECT ws_from.name as from_status, ws_to.name as to_status, " +
           "COUNT(*) as transition_count, " +
           "AVG(EXTRACT(EPOCH FROM (ct2.transitioned_at - ct1.transitioned_at))/3600.0) as avg_hours " +
           "FROM case_transitions ct2 " +
           "JOIN case_transitions ct1 ON ct1.case_id = ct2.case_id " +
           "  AND ct1.to_status_id = ct2.from_status_id " +
           "  AND ct1.transitioned_at = (" +
           "    SELECT MAX(ct3.transitioned_at) FROM case_transitions ct3 " +
           "    WHERE ct3.case_id = ct2.case_id AND ct3.to_status_id = ct2.from_status_id " +
           "    AND ct3.transitioned_at < ct2.transitioned_at) " +
           "JOIN workflow_statuses ws_from ON ws_from.id = ct2.from_status_id " +
           "JOIN workflow_statuses ws_to ON ws_to.id = ct2.to_status_id " +
           "JOIN investigation_cases ic ON ic.id = ct2.case_id " +
           "WHERE ct2.from_status_id IS NOT NULL " +
           "AND (:caseTypeId IS NULL OR ic.case_type_id = :caseTypeId) " +
           "AND (:countryId IS NULL OR ic.country_id = :countryId) " +
           "AND (:lineOfBusiness IS NULL OR ic.line_of_business = :lineOfBusiness) " +
           "GROUP BY ws_from.name, ws_to.name " +
           "ORDER BY ws_from.name, ws_to.name", nativeQuery = true)
    List<Object[]> getTransitionMetricsNative(
            @Param("caseTypeId") Integer caseTypeId,
            @Param("countryId") Integer countryId,
            @Param("lineOfBusiness") String lineOfBusiness);

    @Query("SELECT fs.name, ts.name, COUNT(t) " +
           "FROM CaseTransition t " +
           "JOIN t.fromStatus fs " +
           "JOIN t.toStatus ts " +
           "JOIN t.investigationCase c " +
           "WHERE t.fromStatus IS NOT NULL " +
           "AND (:caseTypeId IS NULL OR c.caseType.id = :caseTypeId) " +
           "AND (:countryId IS NULL OR c.country.id = :countryId) " +
           "AND (:lineOfBusiness IS NULL OR c.lineOfBusiness = :lineOfBusiness) " +
           "GROUP BY fs.name, ts.name")
    List<Object[]> getTransitionCounts(
            @Param("caseTypeId") Integer caseTypeId,
            @Param("countryId") Integer countryId,
            @Param("lineOfBusiness") String lineOfBusiness);
}
