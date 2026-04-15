package com.fincrime.processmining.dto;

import java.util.List;

public record ProcessFlowDto(
        List<String> statuses,
        List<FlowEdge> edges) {

    public record FlowEdge(
            String from,
            String to,
            Long count,
            Double avgHours) {}
}
