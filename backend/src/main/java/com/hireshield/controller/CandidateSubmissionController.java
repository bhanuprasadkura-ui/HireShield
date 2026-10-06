package com.hireshield.controller;

import com.hireshield.dto.AssessmentSubmissionResponse;
import com.hireshield.model.AssessmentSubmission;
import com.hireshield.model.User;
import com.hireshield.repository.UserRepository;
import com.hireshield.service.AssessmentSubmissionService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidate/submissions")
@CrossOrigin(origins = "http://localhost:5500")
public class CandidateSubmissionController {

    private final AssessmentSubmissionService submissionService;
    private final UserRepository userRepository;

    public CandidateSubmissionController(
            AssessmentSubmissionService submissionService,
            UserRepository userRepository) {

        this.submissionService = submissionService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<AssessmentSubmissionResponse>> getMySubmissions(
            Authentication authentication) {

        String email = authentication.getName();

        User candidate = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!"CANDIDATE".equals(candidate.getRole())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .build();
        }

        List<AssessmentSubmissionResponse> response =
                submissionService
                        .getCandidateSubmissions(candidate.getId())
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