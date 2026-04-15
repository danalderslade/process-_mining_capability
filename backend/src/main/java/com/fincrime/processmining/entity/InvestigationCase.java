package com.fincrime.processmining.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "investigation_cases")
public class InvestigationCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "case_reference", nullable = false, unique = true, length = 20)
    private String caseReference;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "case_type_id", nullable = false)
    private CaseType caseType;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @Column(name = "line_of_business", nullable = false, length = 20)
    private String lineOfBusiness;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "current_status_id", nullable = false)
    private WorkflowStatus currentStatus;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public InvestigationCase() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getCaseReference() { return caseReference; }
    public void setCaseReference(String caseReference) { this.caseReference = caseReference; }
    public CaseType getCaseType() { return caseType; }
    public void setCaseType(CaseType caseType) { this.caseType = caseType; }
    public Country getCountry() { return country; }
    public void setCountry(Country country) { this.country = country; }
    public String getLineOfBusiness() { return lineOfBusiness; }
    public void setLineOfBusiness(String lineOfBusiness) { this.lineOfBusiness = lineOfBusiness; }
    public WorkflowStatus getCurrentStatus() { return currentStatus; }
    public void setCurrentStatus(WorkflowStatus currentStatus) { this.currentStatus = currentStatus; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
