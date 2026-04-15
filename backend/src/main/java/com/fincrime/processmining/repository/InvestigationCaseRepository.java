package com.fincrime.processmining.repository;

import com.fincrime.processmining.entity.InvestigationCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestigationCaseRepository extends JpaRepository<InvestigationCase, Integer> {

    @Query("SELECT c FROM InvestigationCase c " +
           "WHERE (:caseTypeId IS NULL OR c.caseType.id = :caseTypeId) " +
           "AND (:countryId IS NULL OR c.country.id = :countryId) " +
           "AND (:lineOfBusiness IS NULL OR c.lineOfBusiness = :lineOfBusiness)")
    List<InvestigationCase> findFiltered(
            @Param("caseTypeId") Integer caseTypeId,
            @Param("countryId") Integer countryId,
            @Param("lineOfBusiness") String lineOfBusiness);

    @Query("SELECT ws.name, COUNT(c) FROM InvestigationCase c " +
           "JOIN c.currentStatus ws " +
           "WHERE (:caseTypeId IS NULL OR c.caseType.id = :caseTypeId) " +
           "AND (:countryId IS NULL OR c.country.id = :countryId) " +
           "AND (:lineOfBusiness IS NULL OR c.lineOfBusiness = :lineOfBusiness) " +
           "GROUP BY ws.name, ws.displayOrder ORDER BY ws.displayOrder")
    List<Object[]> countByStatus(
            @Param("caseTypeId") Integer caseTypeId,
            @Param("countryId") Integer countryId,
            @Param("lineOfBusiness") String lineOfBusiness);
}
