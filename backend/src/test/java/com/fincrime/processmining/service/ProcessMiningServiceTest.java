package com.fincrime.processmining.service;

import com.fincrime.processmining.dto.*;
import com.fincrime.processmining.entity.*;
import com.fincrime.processmining.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProcessMiningServiceTest {

    @Mock
    private InvestigationCaseRepository caseRepository;

    @Mock
    private CaseTransitionRepository transitionRepository;

    @Mock
    private CaseTypeRepository caseTypeRepository;

    @Mock
    private CountryRepository countryRepository;

    @Mock
    private WorkflowStatusRepository statusRepository;

    @InjectMocks
    private ProcessMiningService service;

    private CaseType caseType;
    private Country country;
    private WorkflowStatus status;

    @BeforeEach
    void setUp() {
        caseType = new CaseType();
        caseType.setId(1);
        caseType.setName("Fraud");

        country = new Country();
        country.setId(1);
        country.setCode("GBR");
        country.setName("United Kingdom");

        status = new WorkflowStatus();
        status.setId(1);
        status.setName("NEW");
        status.setDisplayOrder(1);
    }

    // --- getDashboard tests ---

    @Test
    void getDashboard_returnsAggregatedData() {
        Object[] statusRow = new Object[]{"NEW", 10L};
        List<Object[]> statusRows = new java.util.ArrayList<>();
        statusRows.add(statusRow);
        when(caseRepository.countByStatus(null, null, null))
                .thenReturn(statusRows);

        Object[] metricRow = new Object[]{"NEW", "UNDER_INVESTIGATION", 8L, 24.5};
        List<Object[]> metricRows = new java.util.ArrayList<>();
        metricRows.add(metricRow);
        when(transitionRepository.getTransitionMetricsNative(null, null, null))
                .thenReturn(metricRows);

        when(transitionRepository.getTransitionCounts(null, null, null))
                .thenReturn(Collections.emptyList());

        WorkflowStatus s1 = new WorkflowStatus();
        s1.setName("NEW");
        s1.setDisplayOrder(1);
        WorkflowStatus s2 = new WorkflowStatus();
        s2.setName("UNDER_INVESTIGATION");
        s2.setDisplayOrder(2);
        when(statusRepository.findAll()).thenReturn(List.of(s2, s1));

        Timestamp ts = Timestamp.valueOf(LocalDateTime.of(2025, 6, 1, 0, 0));
        Object[] trendRow = new Object[]{ts, 48.0, 5L};
        List<Object[]> trendRows = new java.util.ArrayList<>();
        trendRows.add(trendRow);
        when(transitionRepository.getTransitionTrendByMonth(eq("UNDER_INVESTIGATION"), eq("REVIEW"), isNull(), isNull(), isNull()))
                .thenReturn(trendRows);

        DashboardDto result = service.getDashboard(null, null, null);

        assertThat(result.totalCases()).isEqualTo(10L);
        assertThat(result.statusCounts()).hasSize(1);
        assertThat(result.statusCounts().get(0).status()).isEqualTo("NEW");
        assertThat(result.statusCounts().get(0).count()).isEqualTo(10L);
        assertThat(result.transitionMetrics()).hasSize(1);
        assertThat(result.transitionMetrics().get(0).fromStatus()).isEqualTo("NEW");
        assertThat(result.transitionMetrics().get(0).avgHours()).isEqualTo(24.5);
        assertThat(result.processFlow().statuses()).containsExactly("NEW", "UNDER_INVESTIGATION");
        assertThat(result.investigationToReviewTrend()).hasSize(1);
        assertThat(result.investigationToReviewTrend().get(0).month()).isEqualTo("2025-06");
    }

    @Test
    void getDashboard_withFilters_passesThrough() {
        when(caseRepository.countByStatus(1, 2, "RETAIL"))
                .thenReturn(Collections.emptyList());
        when(transitionRepository.getTransitionMetricsNative(1, 2, "RETAIL"))
                .thenReturn(Collections.emptyList());
        when(transitionRepository.getTransitionCounts(1, 2, "RETAIL"))
                .thenReturn(Collections.emptyList());
        when(statusRepository.findAll()).thenReturn(Collections.emptyList());
        when(transitionRepository.getTransitionTrendByMonth("UNDER_INVESTIGATION", "REVIEW", 1, 2, "RETAIL"))
                .thenReturn(Collections.emptyList());

        DashboardDto result = service.getDashboard(1, 2, "RETAIL");

        assertThat(result.totalCases()).isEqualTo(0L);
        assertThat(result.statusCounts()).isEmpty();
        assertThat(result.transitionMetrics()).isEmpty();
    }

    @Test
    void getDashboard_handlesNullAvgHoursInMetrics() {
        when(caseRepository.countByStatus(null, null, null))
                .thenReturn(Collections.emptyList());

        Object[] metricRow = new Object[]{"NEW", "UNDER_INVESTIGATION", 5L, null};
        List<Object[]> metricRows = new java.util.ArrayList<>();
        metricRows.add(metricRow);
        when(transitionRepository.getTransitionMetricsNative(null, null, null))
                .thenReturn(metricRows);
        when(transitionRepository.getTransitionCounts(null, null, null))
                .thenReturn(Collections.emptyList());
        when(statusRepository.findAll()).thenReturn(Collections.emptyList());
        when(transitionRepository.getTransitionTrendByMonth(any(), any(), isNull(), isNull(), isNull()))
                .thenReturn(Collections.emptyList());

        DashboardDto result = service.getDashboard(null, null, null);

        assertThat(result.transitionMetrics().get(0).avgHours()).isNull();
    }

    // --- getCases tests ---

    @Test
    void getCases_returnsFilteredCases() {
        InvestigationCase ic = buildCase(1, "FC-001", caseType, country, status, "RETAIL");
        when(caseRepository.findFiltered(null, null, null)).thenReturn(List.of(ic));

        List<CaseDto> result = service.getCases(null, null, null);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).caseReference()).isEqualTo("FC-001");
        assertThat(result.get(0).caseType()).isEqualTo("Fraud");
        assertThat(result.get(0).country()).isEqualTo("United Kingdom");
        assertThat(result.get(0).countryCode()).isEqualTo("GBR");
        assertThat(result.get(0).lineOfBusiness()).isEqualTo("RETAIL");
        assertThat(result.get(0).currentStatus()).isEqualTo("NEW");
    }

    @Test
    void getCases_returnsEmptyListWhenNoCases() {
        when(caseRepository.findFiltered(null, null, null)).thenReturn(Collections.emptyList());

        List<CaseDto> result = service.getCases(null, null, null);

        assertThat(result).isEmpty();
    }

    @Test
    void getCases_handlesNullCaseType() {
        InvestigationCase ic = buildCase(1, "FC-002", null, country, status, "COMMERCIAL");
        when(caseRepository.findFiltered(null, null, null)).thenReturn(List.of(ic));

        List<CaseDto> result = service.getCases(null, null, null);

        assertThat(result.get(0).caseType()).isEqualTo("Unknown");
    }

    @Test
    void getCases_handlesNullCountry() {
        InvestigationCase ic = buildCase(1, "FC-003", caseType, null, status, "RETAIL");
        when(caseRepository.findFiltered(null, null, null)).thenReturn(List.of(ic));

        List<CaseDto> result = service.getCases(null, null, null);

        assertThat(result.get(0).country()).isEqualTo("Unknown");
        assertThat(result.get(0).countryCode()).isEqualTo("UNK");
    }

    @Test
    void getCases_handlesNullStatus() {
        InvestigationCase ic = buildCase(1, "FC-004", caseType, country, null, "RETAIL");
        when(caseRepository.findFiltered(null, null, null)).thenReturn(List.of(ic));

        List<CaseDto> result = service.getCases(null, null, null);

        assertThat(result.get(0).currentStatus()).isEqualTo("Unknown");
    }

    // --- getCaseTransitions tests ---

    @Test
    void getCaseTransitions_returnsSortedTransitions() {
        WorkflowStatus fromStatus = new WorkflowStatus();
        fromStatus.setName("NEW");
        WorkflowStatus toStatus = new WorkflowStatus();
        toStatus.setName("UNDER_INVESTIGATION");

        CaseTransition t = new CaseTransition();
        t.setFromStatus(fromStatus);
        t.setToStatus(toStatus);
        t.setTransitionedAt(LocalDateTime.of(2025, 6, 1, 10, 0));
        t.setTransitionedBy("analyst@bank.com");

        when(transitionRepository.findByCaseIdOrdered(1)).thenReturn(List.of(t));

        List<CaseTransitionDto> result = service.getCaseTransitions(1);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).fromStatus()).isEqualTo("NEW");
        assertThat(result.get(0).toStatus()).isEqualTo("UNDER_INVESTIGATION");
        assertThat(result.get(0).transitionedBy()).isEqualTo("analyst@bank.com");
    }

    @Test
    void getCaseTransitions_handlesNullFromStatus() {
        WorkflowStatus toStatus = new WorkflowStatus();
        toStatus.setName("NEW");

        CaseTransition t = new CaseTransition();
        t.setFromStatus(null);
        t.setToStatus(toStatus);
        t.setTransitionedAt(LocalDateTime.of(2025, 6, 1, 10, 0));
        t.setTransitionedBy("system");

        when(transitionRepository.findByCaseIdOrdered(1)).thenReturn(List.of(t));

        List<CaseTransitionDto> result = service.getCaseTransitions(1);

        assertThat(result.get(0).fromStatus()).isNull();
        assertThat(result.get(0).toStatus()).isEqualTo("NEW");
    }

    @Test
    void getCaseTransitions_returnsEmptyForUnknownCase() {
        when(transitionRepository.findByCaseIdOrdered(999)).thenReturn(Collections.emptyList());

        List<CaseTransitionDto> result = service.getCaseTransitions(999);

        assertThat(result).isEmpty();
    }

    // --- getFilterOptions tests ---

    @Test
    void getFilterOptions_returnsAllOptions() {
        when(caseTypeRepository.findAll()).thenReturn(List.of(caseType));
        when(countryRepository.findAll()).thenReturn(List.of(country));

        FilterOptionsDto result = service.getFilterOptions();

        assertThat(result.caseTypes()).hasSize(1);
        assertThat(result.caseTypes().get(0).id()).isEqualTo(1);
        assertThat(result.caseTypes().get(0).name()).isEqualTo("Fraud");
        assertThat(result.countries()).hasSize(1);
        assertThat(result.countries().get(0).name()).isEqualTo("United Kingdom");
        assertThat(result.linesOfBusiness()).containsExactly("RETAIL", "COMMERCIAL");
    }

    @Test
    void getFilterOptions_handlesEmptyReferenceData() {
        when(caseTypeRepository.findAll()).thenReturn(Collections.emptyList());
        when(countryRepository.findAll()).thenReturn(Collections.emptyList());

        FilterOptionsDto result = service.getFilterOptions();

        assertThat(result.caseTypes()).isEmpty();
        assertThat(result.countries()).isEmpty();
        assertThat(result.linesOfBusiness()).hasSize(2);
    }

    // --- Helper ---

    private InvestigationCase buildCase(Integer id, String ref, CaseType ct, Country co,
                                         WorkflowStatus ws, String lob) {
        InvestigationCase ic = new InvestigationCase();
        ic.setId(id);
        ic.setCaseReference(ref);
        ic.setCaseType(ct);
        ic.setCountry(co);
        ic.setCurrentStatus(ws);
        ic.setLineOfBusiness(lob);
        ic.setCreatedAt(LocalDateTime.of(2025, 1, 15, 9, 0));
        ic.setUpdatedAt(LocalDateTime.of(2025, 6, 1, 14, 30));
        return ic;
    }
}
