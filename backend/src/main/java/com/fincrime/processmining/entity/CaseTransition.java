package com.fincrime.processmining.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "case_transitions")
public class CaseTransition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    private InvestigationCase investigationCase;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "from_status_id")
    private WorkflowStatus fromStatus;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "to_status_id", nullable = false)
    private WorkflowStatus toStatus;

    @Column(name = "transitioned_at", nullable = false)
    private LocalDateTime transitionedAt;

    @Column(name = "transitioned_by", length = 100)
    private String transitionedBy;

    public CaseTransition() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public InvestigationCase getInvestigationCase() { return investigationCase; }
    public void setInvestigationCase(InvestigationCase investigationCase) { this.investigationCase = investigationCase; }
    public WorkflowStatus getFromStatus() { return fromStatus; }
    public void setFromStatus(WorkflowStatus fromStatus) { this.fromStatus = fromStatus; }
    public WorkflowStatus getToStatus() { return toStatus; }
    public void setToStatus(WorkflowStatus toStatus) { this.toStatus = toStatus; }
    public LocalDateTime getTransitionedAt() { return transitionedAt; }
    public void setTransitionedAt(LocalDateTime transitionedAt) { this.transitionedAt = transitionedAt; }
    public String getTransitionedBy() { return transitionedBy; }
    public void setTransitionedBy(String transitionedBy) { this.transitionedBy = transitionedBy; }
}
