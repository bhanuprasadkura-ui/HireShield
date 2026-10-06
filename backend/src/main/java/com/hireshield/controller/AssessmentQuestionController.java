package com.hireshield.controller;

import com.hireshield.dto.AssessmentQuestionResponse;
import com.hireshield.model.Assessment;
import com.hireshield.model.AssessmentQuestion;
import com.hireshield.model.User;
import com.hireshield.repository.AssessmentRepository;
import com.hireshield.repository.UserRepository;
import com.hireshield.service.AssessmentQuestionService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
@CrossOrigin(origins = "http://localhost:5500")
public class AssessmentQuestionController {

    private final AssessmentQuestionService questionService;
    private final AssessmentRepository assessmentRepository;
    private final UserRepository userRepository;

    public AssessmentQuestionController(
            AssessmentQuestionService questionService,
            AssessmentRepository assessmentRepository,
            UserRepository userRepository) {

        this.questionService = questionService;
        this.assessmentRepository = assessmentRepository;
        this.userRepository = userRepository;
    }

    // ==========================================
    // RECRUITER: CREATE QUESTION
    // ==========================================

    @PostMapping("/{assessmentId}/questions")
    public ResponseEntity<AssessmentQuestionResponse> createQuestion(
            @PathVariable Long assessmentId,
            @RequestBody AssessmentQuestion question,
            Authentication authentication) {

        String email = authentication.getName();

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Only recruiters can create questions
        if (!"RECRUITER".equals(recruiter.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Assessment assessment =
                assessmentRepository
                        .findByIdAndRecruiterId(
                                assessmentId,
                                recruiter.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Assessment not found"));

        question.setAssessment(assessment);

        AssessmentQuestion savedQuestion =
                questionService.createQuestion(question);

        return ResponseEntity.ok(
                toResponse(savedQuestion)
        );
    }

    // ==========================================
    // VIEW QUESTIONS
    // ==========================================

    @GetMapping("/{assessmentId}/questions")
    public ResponseEntity<List<AssessmentQuestionResponse>> getQuestions(
            @PathVariable Long assessmentId) {

        List<AssessmentQuestionResponse> response =
                questionService
                        .getQuestionsByAssessment(assessmentId)
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // RECRUITER: DELETE QUESTION
    // ==========================================

    @DeleteMapping("/{assessmentId}/questions/{questionId}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable Long assessmentId,
            @PathVariable Long questionId,
            Authentication authentication) {

        String email = authentication.getName();

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Only recruiters can delete questions
        if (!"RECRUITER".equals(recruiter.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Make sure the assessment belongs to this recruiter
        assessmentRepository
                .findByIdAndRecruiterId(
                        assessmentId,
                        recruiter.getId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Assessment not found"));

        // Make sure the question belongs to this assessment
        questionService
                .findQuestionInAssessment(
                        questionId,
                        assessmentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Question not found"));

        questionService.deleteQuestion(questionId);

        return ResponseEntity.noContent().build();
    }

    // ==========================================
    // CONVERT QUESTION TO RESPONSE
    // ==========================================

    private AssessmentQuestionResponse toResponse(
            AssessmentQuestion question) {

        return new AssessmentQuestionResponse(
                question.getId(),
                question.getAssessment().getId(),
                question.getQuestionText(),
                question.getOptionA(),
                question.getOptionB(),
                question.getOptionC(),
                question.getOptionD()
        );
    }
}