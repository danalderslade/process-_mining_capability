package com.fincrime.processmining.dto;

public record FilterOptionsDto(
        java.util.List<IdNameDto> caseTypes,
        java.util.List<IdNameDto> countries,
        java.util.List<String> linesOfBusiness) {

    public record IdNameDto(Integer id, String name) {}
}
