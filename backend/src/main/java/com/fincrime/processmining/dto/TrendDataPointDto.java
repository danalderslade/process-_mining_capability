package com.fincrime.processmining.dto;

public record TrendDataPointDto(
        String month,
        Double avgHours,
        Long count) {}
