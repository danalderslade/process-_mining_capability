package com.fincrime.processmining.service;

import com.fincrime.processmining.dto.*;
import com.fincrime.processmining.entity.CaseTransition;
import com.fincrime.processmining.entity.InvestigationCase;
import com.fincrime.processmining.repository.*;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProcessMiningService {

    private final InvestigationCaseRepository caseRepository;
    private final CaseTransitionRepository transitionRepository;
    private final CaseTypeRepository caseTypeRepository;
    private final CountryRepository countryRepository;
    private final WorkflowStatusRepository statusRepository;

    public ProcessMiningService(InvestigationCaseRepository caseRepository,
                                CaseTransitionRepository transitionRepository,
                                CaseTypeRepository caseTypeRepository,
                                CountryRepository countryRepository,
                                WorkflowStatusRepository statusRepository) {
        this.caseRepository = caseRepository;
        this.transitionRepository = transitionRepository;
        this.caseTypeRepository = caseTypeRepository;
        this.countryRepository = countryRepository;
        this.statusRepository = statusRepository;
    }

    public DashboardDto getDashboard(Integer caseTypeId, Integer countryId, String lineOfBusiness) {
        List<StatusCountDto> statusCounts = caseRepository.countByStatus(caseTypeId, countryId, lineOfBusiness)
                .stream()
                .map(row -> new StatusCountDto((String) row[0], (Long) row[1]))
                .toList();

        long totalCases = statusCounts.stream().mapToLong(StatusCountDto::count).sum();

        List<TransitionMetricDto> transitionMetrics = transitionRepository
                .getTransitionMetricsNative(caseTypeId, countryId, lineOfBusiness)
                .stream()
                .map(row -> new TransitionMetricDto(
                        (String) row[0],
                        (String) row[1],
                        ((Number) row[2]).longValue(),
                        row[3] != null ? ((Number) row[3]).doubleValue() : null))
                .toList();

        List<Object[]> flowData = transitionRepository.getTransitionCounts(caseTypeId, countryId, lineOfBusiness);
        List<String> statuses = statusRepository.findAll().stream()
                .sorted((a, b) -> a.getDisplayOrder().compareTo(b.getDisplayOrder()))
                .map(s -> s.getName())
                .toList();

        List<ProcessFlowDto.FlowEdge> edges = transitionMetrics.stream()
                .map(tm -> new ProcessFlowDto.FlowEdge(tm.fromStatus(), tm.toStatus(), tm.count(), tm.avgHours()))
                .toList();

        ProcessFlowDto processFlow = new ProcessFlowDto(statuses, edges);

        return new DashboardDto(statusCounts, totalCases, transitionMetrics, processFlow);
    }

    public List<CaseDto> getCases(Integer caseTypeId, Integer countryId, String lineOfBusiness) {
        return caseRepository.findFiltered(caseTypeId, countryId, lineOfBusiness)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public List<CaseTransitionDto> getCaseTransitions(Integer caseId) {
        return transitionRepository.findByCaseIdOrdered(caseId)
                .stream()
                .map(t -> new CaseTransitionDto(
                        t.getFromStatus() != null ? t.getFromStatus().getName() : null,
                        t.getToStatus().getName(),
                        t.getTransitionedAt(),
                        t.getTransitionedBy()))
                .toList();
    }

    public FilterOptionsDto getFilterOptions() {
        var caseTypes = caseTypeRepository.findAll().stream()
                .map(ct -> new FilterOptionsDto.IdNameDto(ct.getId(), ct.getName()))
                .toList();
        var countries = countryRepository.findAll().stream()
                .map(c -> new FilterOptionsDto.IdNameDto(c.getId(), c.getName()))
                .toList();
        var lobs = Arrays.asList("RETAIL", "COMMERCIAL");
        return new FilterOptionsDto(caseTypes, countries, lobs);
    }

    private CaseDto toDto(InvestigationCase c) {
        return new CaseDto(
                c.getId(),
                c.getCaseReference(),
                c.getCaseType().getName(),
                c.getCountry().getName(),
                c.getCountry().getCode(),
                c.getLineOfBusiness(),
                c.getCurrentStatus().getName(),
                c.getCreatedAt(),
                c.getUpdatedAt());
    }
}
