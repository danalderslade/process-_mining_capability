package com.fincrime.processmining.controller;

import com.fincrime.processmining.dto.*;
import com.fincrime.processmining.service.ProcessMiningService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProcessMiningControllerTest {

    @Mock
    private ProcessMiningService service;

    @InjectMocks
    private ProcessMiningController controller;

    @Test
    void getDashboard_returnsOkWithData() {
        DashboardDto dto = new DashboardDto(
                List.of(new StatusCountDto("NEW", 5L)),
                5L,
                Collections.emptyList(),
                new ProcessFlowDto(List.of("NEW"), Collections.emptyList()),
                Collections.emptyList()
        );
        when(service.getDashboard(null, null, null)).thenReturn(dto);

        ResponseEntity<DashboardDto> response = controller.getDashboard(null, null, null);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().totalCases()).isEqualTo(5L);
    }

    @Test
    void getDashboard_passesFiltersToService() {
        DashboardDto dto = new DashboardDto(Collections.emptyList(), 0L,
                Collections.emptyList(), new ProcessFlowDto(Collections.emptyList(), Collections.emptyList()),
                Collections.emptyList());
        when(service.getDashboard(1, 2, "RETAIL")).thenReturn(dto);

        controller.getDashboard(1, 2, "RETAIL");

        verify(service).getDashboard(1, 2, "RETAIL");
    }

    @Test
    void getCases_returnsOkWithCaseList() {
        CaseDto caseDto = new CaseDto(1, "FC-001", "Fraud", "UK", "GBR", "RETAIL", "NEW",
                LocalDateTime.now(), LocalDateTime.now());
        when(service.getCases(null, null, null)).thenReturn(List.of(caseDto));

        ResponseEntity<List<CaseDto>> response = controller.getCases(null, null, null);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).hasSize(1);
        assertThat(response.getBody().get(0).caseReference()).isEqualTo("FC-001");
    }

    @Test
    void getCases_passesFiltersToService() {
        when(service.getCases(3, 4, "COMMERCIAL")).thenReturn(Collections.emptyList());

        controller.getCases(3, 4, "COMMERCIAL");

        verify(service).getCases(3, 4, "COMMERCIAL");
    }

    @Test
    void getCaseTransitions_returnsOkWithTransitions() {
        CaseTransitionDto t = new CaseTransitionDto("NEW", "UNDER_INVESTIGATION",
                LocalDateTime.now(), "analyst@bank.com");
        when(service.getCaseTransitions(1)).thenReturn(List.of(t));

        ResponseEntity<List<CaseTransitionDto>> response = controller.getCaseTransitions(1);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).hasSize(1);
    }

    @Test
    void getCaseTransitions_returnsEmptyListForUnknownCase() {
        when(service.getCaseTransitions(999)).thenReturn(Collections.emptyList());

        ResponseEntity<List<CaseTransitionDto>> response = controller.getCaseTransitions(999);

        assertThat(response.getBody()).isEmpty();
    }

    @Test
    void getFilterOptions_returnsOkWithOptions() {
        FilterOptionsDto opts = new FilterOptionsDto(
                List.of(new FilterOptionsDto.IdNameDto(1, "Fraud")),
                List.of(new FilterOptionsDto.IdNameDto(1, "UK")),
                List.of("RETAIL", "COMMERCIAL")
        );
        when(service.getFilterOptions()).thenReturn(opts);

        ResponseEntity<FilterOptionsDto> response = controller.getFilterOptions();

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody().caseTypes()).hasSize(1);
        assertThat(response.getBody().linesOfBusiness()).containsExactly("RETAIL", "COMMERCIAL");
    }
}
