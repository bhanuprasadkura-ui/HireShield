package com.hireshield.controller;

import com.hireshield.dto.AssessmentQuestionResponse;
import com.hireshield.dto.CandidateAssessmentResponse;
import com.hireshield.model.Assessment;
import com.hireshield.model.User;
import com.hireshield.repository.UserRepository;
import com.hireshield.service.AssessmentQuestionService;
import com.hireshield.service.AssessmentService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidate/assessments")
@CrossOrigin(origins = "http://localhost:5500")
public class CandidateAssessmentController {

    private final AssessmentService assessmentService;
    private final AssessmentQuestionService questionService;
    private final UserRepository userRepository;

    public CandidateAssessmentController(
            AssessmentService assessmentService,
            AssessmentQuestionService questionService,
            UserRepository userRepository) {

        this.assessmentService = assessmentService;
        this.questionService = questionService;
        this.userRepository = userRepository;
    }

    // ==========================================
    // CANDIDATE: VIEW ASSESSMENT
    // ==========================================

    @GetMapping("/{assessmentId}")
    public ResponseEntity<CandidateAssessmentResponse> getAssessmentForCandidate(
            @PathVariable Long assessmentId,
            Authentication authentication) {

        String email = authentication.getName();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Only candidates can access candidate assessments
        if (!"CANDIDATE".equals(candidate.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Assessment assessment =
                assessmentService
                        .findAssessment(assessmentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Assessment not found"));

        List<AssessmentQuestionResponse> questions =
                questionService
                        .getQuestionsByAssessment(assessmentId)
                        .stream()
                        .map(question ->
                                new AssessmentQuestionResponse(
                                        question.getId(),
                                        question.getAssessment().getId(),
                                        question.getQuestionText(),
                                        question.getOptionA(),
                                        question.getOptionB(),
                                        question.getOptionC(),
                                        question.getOptionD()
                                ))
                        .toList();

        CandidateAssessmentResponse response =
                new CandidateAssessmentResponse(
                        assessment.getId(),
                        assessment.getTitle(),
                        assessment.getDescription(),
                        assessment.getDuration(),
                        assessment.getTotalQuestions(),
                        questions
                );

        return ResponseEntity.ok(response);
    }
}