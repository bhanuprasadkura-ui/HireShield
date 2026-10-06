package com.hireshield.controller;

import com.hireshield.dto.AssessmentResponse;
import com.hireshield.model.Assessment;
import com.hireshield.model.User;
import com.hireshield.repository.UserRepository;
import com.hireshield.service.AssessmentService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
@CrossOrigin(origins = "http://localhost:5500")
public class AssessmentController {

    private final AssessmentService assessmentService;
    private final UserRepository userRepository;

    public AssessmentController(
            AssessmentService assessmentService,
            UserRepository userRepository) {

        this.assessmentService = assessmentService;
        this.userRepository = userRepository;
    }

    // ==========================================
    // RECRUITER: CREATE ASSESSMENT
    // ==========================================

    @PostMapping
    public ResponseEntity<AssessmentResponse> createAssessment(
            @RequestBody Assessment assessment,
            Authentication authentication) {

        String email = authentication.getName();

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Only recruiters can create assessments
        if (!"RECRUITER".equals(recruiter.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        assessment.setRecruiter(recruiter);

        Assessment savedAssessment =
                assessmentService.createAssessment(assessment);

        return ResponseEntity.ok(
                toResponse(savedAssessment)
        );
    }

    // ==========================================
    // RECRUITER: VIEW MY ASSESSMENTS
    // ==========================================

    @GetMapping("/my-assessments")
    public ResponseEntity<List<AssessmentResponse>> getMyAssessments(
            Authentication authentication) {

        String email = authentication.getName();

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Only recruiters can view their assessments
        if (!"RECRUITER".equals(recruiter.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<AssessmentResponse> response =
                assessmentService
                        .getRecruiterAssessments(recruiter.getId())
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // VIEW ALL ASSESSMENTS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<AssessmentResponse>> getAllAssessments() {

        List<AssessmentResponse> response =
                assessmentService
                        .getAllAssessments()
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // VIEW SINGLE ASSESSMENT
    // ==========================================

    @GetMapping("/{assessmentId}")
    public ResponseEntity<AssessmentResponse> getAssessment(
            @PathVariable Long assessmentId) {

        Assessment assessment =
                assessmentService
                        .findAssessment(assessmentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Assessment not found"));

        return ResponseEntity.ok(
                toResponse(assessment)
        );
    }

    // ==========================================
    // RECRUITER: DELETE ASSESSMENT
    // ==========================================

    @DeleteMapping("/{assessmentId}")
    public ResponseEntity<Void> deleteAssessment(
            @PathVariable Long assessmentId,
            Authentication authentication) {

        String email = authentication.getName();

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Only recruiters can delete assessments
        if (!"RECRUITER".equals(recruiter.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        assessmentService.deleteAssessment(
                assessmentId,
                recruiter.getId()
        );

        return ResponseEntity.noContent().build();
    }

    // ==========================================
    // CONVERT ASSESSMENT TO RESPONSE
    // ==========================================

    private AssessmentResponse toResponse(
            Assessment assessment) {

        return new AssessmentResponse(
                assessment.getId(),
                assessment.getTitle(),
                assessment.getDescription(),
                assessment.getDuration(),
                assessment.getTotalQuestions(),
                assessment.getRecruiter().getId()
        );
    }
}