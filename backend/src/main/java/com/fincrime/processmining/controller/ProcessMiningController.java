package com.fincrime.processmining.controller;

import com.fincrime.processmining.dto.*;
import com.fincrime.processmining.service.ProcessMiningService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProcessMiningController {

    private final ProcessMiningService service;

    public ProcessMiningController(ProcessMiningService service) {
        this.service = service;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDto> getDashboard(
            @RequestParam(required = false) Integer caseTypeId,
            @RequestParam(required = false) Integer countryId,
            @RequestParam(required = false) String lineOfBusiness) {
        return ResponseEntity.ok(service.getDashboard(caseTypeId, countryId, lineOfBusiness));
    }

    @GetMapping("/cases")
    public ResponseEntity<List<CaseDto>> getCases(
            @RequestParam(required = false) Integer caseTypeId,
            @RequestParam(required = false) Integer countryId,
            @RequestParam(required = false) String lineOfBusiness) {
        return ResponseEntity.ok(service.getCases(caseTypeId, countryId, lineOfBusiness));
    }

    @GetMapping("/cases/{caseId}/transitions")
    public ResponseEntity<List<CaseTransitionDto>> getCaseTransitions(
            @PathVariable Integer caseId) {
        return ResponseEntity.ok(service.getCaseTransitions(caseId));
    }

    @GetMapping("/filters")
    public ResponseEntity<FilterOptionsDto> getFilterOptions() {
        return ResponseEntity.ok(service.getFilterOptions());
    }
}
