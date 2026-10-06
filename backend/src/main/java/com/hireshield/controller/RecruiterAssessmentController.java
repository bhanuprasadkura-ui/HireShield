package com.hireshield.controller;

import com.hireshield.dto.AssessmentSubmissionResponse;
import com.hireshield.model.Assessment;
import com.hireshield.model.AssessmentSubmission;
import com.hireshield.model.User;
import com.hireshield.repository.AssessmentRepository;
import com.hireshield.repository.UserRepository;
import com.hireshield.service.AssessmentSubmissionService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter/assessments")
@CrossOrigin(origins = "http://localhost:5500")
public class RecruiterAssessmentController {

    private final AssessmentSubmissionService submissionService;
    private final AssessmentRepository assessmentRepository;
    private final UserRepository userRepository;

    public RecruiterAssessmentController(
            AssessmentSubmissionService submissionService,
            AssessmentRepository assessmentRepository,
            UserRepository userRepository) {

        this.submissionService = submissionService;
        this.assessmentRepository = assessmentRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/{assessmentId}/results")
    public ResponseEntity<List<AssessmentSubmissionResponse>> getAssessmentResults(
            @PathVariable Long assessmentId,
            Authentication authentication) {

        String email = authentication.getName();

        User recruiter = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!"RECRUITER".equals(recruiter.getRole())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .build();
        }

        Assessment assessment =
                assessmentRepository
                        .findByIdAndRecruiterId(
                                assessmentId,
                                recruiter.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Assessment not found"));

        List<AssessmentSubmissionResponse> response =
                submissionService
                        .getAssessmentSubmissions(
                                assessment.getId())
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    private AssessmentSubmissionResponse toResponse(
            AssessmentSubmission submission) {

        return new AssessmentSubmissionResponse(
                submission.getId(),
                submission.getAssessment().getId(),
                submission.getAssessment().getTitle(),
                submission.getCandidate().getId(),
                submission.getCandidate().getName(),
                submission.getCandidate().getEmail(),
                submission.getScore(),
                submission.getTotalQuestions(),
                submission.getPercentage(),
                submission.getStatus()
        );
    }
}