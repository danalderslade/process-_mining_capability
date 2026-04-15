package com.fincrime.processmining.controller;

import com.fincrime.processmining.dto.*;
import com.fincrime.processmining.service.ProcessMiningService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProcessMiningController.class)
@Import(com.fincrime.processmining.config.SecurityConfig.class)
@TestPropertySource(properties = "app.cors.allowed-origins=http://localhost:3000")
class ProcessMiningApiTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProcessMiningService service;

    // --- /api/dashboard ---

    @Test
    void getDashboard_returns200() throws Exception {
        DashboardDto dto = new DashboardDto(
                List.of(new StatusCountDto("NEW", 10L)),
                10L,
                List.of(new TransitionMetricDto("NEW", "UNDER_INVESTIGATION", 8L, 24.5)),
                new ProcessFlowDto(List.of("NEW"), Collections.emptyList()),
                List.of(new TrendDataPointDto("2025-06", 48.0, 5L))
        );
        when(service.getDashboard(isNull(), isNull(), isNull())).thenReturn(dto);

        mockMvc.perform(get("/api/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCases", is(10)))
                .andExpect(jsonPath("$.statusCounts", hasSize(1)))
                .andExpect(jsonPath("$.statusCounts[0].status", is("NEW")))
                .andExpect(jsonPath("$.transitionMetrics[0].avgHours", is(24.5)))
                .andExpect(jsonPath("$.processFlow.statuses[0]", is("NEW")))
                .andExpect(jsonPath("$.investigationToReviewTrend[0].month", is("2025-06")));
    }

    @Test
    void getDashboard_withValidFilters_returns200() throws Exception {
        DashboardDto dto = new DashboardDto(Collections.emptyList(), 0L,
                Collections.emptyList(), new ProcessFlowDto(Collections.emptyList(), Collections.emptyList()),
                Collections.emptyList());
        when(service.getDashboard(1, 2, "RETAIL")).thenReturn(dto);

        mockMvc.perform(get("/api/dashboard")
                        .param("caseTypeId", "1")
                        .param("countryId", "2")
                        .param("lineOfBusiness", "RETAIL"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCases", is(0)));
    }

    @Test
    void getDashboard_withInvalidCaseTypeId_returns400() throws Exception {
        mockMvc.perform(get("/api/dashboard")
                        .param("caseTypeId", "0"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getDashboard_withNegativeCaseTypeId_returns400() throws Exception {
        mockMvc.perform(get("/api/dashboard")
                        .param("caseTypeId", "-1"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getDashboard_withInvalidLineOfBusiness_returns400() throws Exception {
        mockMvc.perform(get("/api/dashboard")
                        .param("lineOfBusiness", "INVALID"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getDashboard_withNonNumericCaseTypeId_returns400() throws Exception {
        mockMvc.perform(get("/api/dashboard")
                        .param("caseTypeId", "abc"))
                .andExpect(status().isBadRequest());
    }

    // --- /api/cases ---

    @Test
    void getCases_returns200WithCases() throws Exception {
        CaseDto dto = new CaseDto(1, "FC-001", "Fraud", "UK", "GBR", "RETAIL", "NEW",
                LocalDateTime.of(2025, 1, 15, 9, 0), LocalDateTime.of(2025, 6, 1, 14, 0));
        when(service.getCases(isNull(), isNull(), isNull())).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/cases"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].caseReference", is("FC-001")))
                .andExpect(jsonPath("$[0].caseType", is("Fraud")))
                .andExpect(jsonPath("$[0].countryCode", is("GBR")));
    }

    @Test
    void getCases_withInvalidCountryId_returns400() throws Exception {
        mockMvc.perform(get("/api/cases")
                        .param("countryId", "0"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getCases_returnsEmptyForNoMatches() throws Exception {
        when(service.getCases(any(), any(), any())).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/cases")
                        .param("caseTypeId", "99"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    // --- /api/cases/{caseId}/transitions ---

    @Test
    void getTransitions_returns200() throws Exception {
        CaseTransitionDto t = new CaseTransitionDto("NEW", "UNDER_INVESTIGATION",
                LocalDateTime.of(2025, 6, 1, 10, 0), "analyst@bank.com");
        when(service.getCaseTransitions(1)).thenReturn(List.of(t));

        mockMvc.perform(get("/api/cases/1/transitions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].fromStatus", is("NEW")))
                .andExpect(jsonPath("$[0].toStatus", is("UNDER_INVESTIGATION")))
                .andExpect(jsonPath("$[0].transitionedBy", is("analyst@bank.com")));
    }

    @Test
    void getTransitions_withInvalidCaseId_returns400() throws Exception {
        mockMvc.perform(get("/api/cases/0/transitions"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getTransitions_withNonNumericCaseId_returns400() throws Exception {
        mockMvc.perform(get("/api/cases/abc/transitions"))
                .andExpect(status().isBadRequest());
    }

    // --- /api/filters ---

    @Test
    void getFilters_returns200() throws Exception {
        FilterOptionsDto opts = new FilterOptionsDto(
                List.of(new FilterOptionsDto.IdNameDto(1, "Fraud")),
                List.of(new FilterOptionsDto.IdNameDto(1, "UK")),
                List.of("RETAIL", "COMMERCIAL")
        );
        when(service.getFilterOptions()).thenReturn(opts);

        mockMvc.perform(get("/api/filters"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.caseTypes", hasSize(1)))
                .andExpect(jsonPath("$.caseTypes[0].name", is("Fraud")))
                .andExpect(jsonPath("$.countries[0].name", is("UK")))
                .andExpect(jsonPath("$.linesOfBusiness", hasSize(2)));
    }

    // --- Security headers ---

    @Test
    void responses_includeSecurityHeaders() throws Exception {
        FilterOptionsDto opts = new FilterOptionsDto(Collections.emptyList(),
                Collections.emptyList(), List.of("RETAIL", "COMMERCIAL"));
        when(service.getFilterOptions()).thenReturn(opts);

        mockMvc.perform(get("/api/filters"))
                .andExpect(header().string("X-Frame-Options", "DENY"))
                .andExpect(header().string("X-Content-Type-Options", "nosniff"))
                .andExpect(header().exists("Referrer-Policy"));
    }

    // --- Non-API routes denied ---

    @Test
    void nonApiRoutes_areDenied() throws Exception {
        mockMvc.perform(get("/admin/settings"))
                .andExpect(status().isForbidden());
    }

    // --- POST not allowed ---

    @Test
    void postToApi_isRejected() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/api/dashboard"))
                .andExpect(status().isMethodNotAllowed());
    }
}
