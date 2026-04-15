package com.fincrime.processmining.dto;

public record TransitionMetricDto(
        String fromStatus,
        String toStatus,
        Long count,
        Double avgHours) {}
