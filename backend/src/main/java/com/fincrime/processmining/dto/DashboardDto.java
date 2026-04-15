package com.fincrime.processmining.dto;

import java.util.List;
import java.util.Map;

public record DashboardDto(
        List<StatusCountDto> statusCounts,
        Long totalCases,
        List<TransitionMetricDto> transitionMetrics,
        ProcessFlowDto processFlow) {}
