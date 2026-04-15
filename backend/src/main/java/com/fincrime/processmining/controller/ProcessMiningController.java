package com.fincrime.processmining.controller;

import com.fincrime.processmining.dto.*;
import com.fincrime.processmining.service.ProcessMiningService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Validated
public class ProcessMiningController {

    private final ProcessMiningService service;

    public ProcessMiningController(ProcessMiningService service) {
        this.service = service;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDto> getDashboard(
            @RequestParam(required = false) @Min(1) Integer caseTypeId,
            @RequestParam(required = false) @Min(1) Integer countryId,
            @RequestParam(required = false) @Pattern(regexp = "^(RETAIL|COMMERCIAL)$", message = "Must be RETAIL or COMMERCIAL") String lineOfBusiness) {
        return ResponseEntity.ok(service.getDashboard(caseTypeId, countryId, lineOfBusiness));
    }

    @GetMapping("/cases")
    public ResponseEntity<List<CaseDto>> getCases(
            @RequestParam(required = false) @Min(1) Integer caseTypeId,
            @RequestParam(required = false) @Min(1) Integer countryId,
            @RequestParam(required = false) @Pattern(regexp = "^(RETAIL|COMMERCIAL)$", message = "Must be RETAIL or COMMERCIAL") String lineOfBusiness) {
        return ResponseEntity.ok(service.getCases(caseTypeId, countryId, lineOfBusiness));
    }

    @GetMapping("/cases/{caseId}/transitions")
    public ResponseEntity<List<CaseTransitionDto>> getCaseTransitions(
            @PathVariable @Min(1) Integer caseId) {
        return ResponseEntity.ok(service.getCaseTransitions(caseId));
    }

    @GetMapping("/filters")
    public ResponseEntity<FilterOptionsDto> getFilterOptions() {
        return ResponseEntity.ok(service.getFilterOptions());
    }
}
