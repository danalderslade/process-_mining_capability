package com.fincrime.processmining.dto;

import java.time.LocalDateTime;

public record CaseDto(
        Integer id,
        String caseReference,
        String caseType,
        String country,
        String countryCode,
        String lineOfBusiness,
        String currentStatus,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {}
