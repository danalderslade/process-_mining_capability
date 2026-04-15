package com.fincrime.processmining.dto;

import java.time.LocalDateTime;

public record CaseTransitionDto(
        String fromStatus,
        String toStatus,
        LocalDateTime transitionedAt,
        String transitionedBy) {}
