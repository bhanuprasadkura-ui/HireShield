package com.hireshield.controller;

import com.hireshield.dto.AssessmentSubmissionRequest;
import com.hireshield.dto.AssessmentSubmissionResponse;
import com.hireshield.model.Application;
import com.hireshield.model.Assessment;
import com.hireshield.model.AssessmentQuestion;
import com.hireshield.model.AssessmentSubmission;
import com.hireshield.model.User;
import com.hireshield.repository.ApplicationRepository;
import com.hireshield.repository.AssessmentQuestionRepository;
import com.hireshield.repository.AssessmentRepository;
import com.hireshield.repository.UserRepository;
import com.hireshield.service.AssessmentSubmissionService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/candidate/assessments")
@CrossOrigin(origins = "http://localhost:5500")
public class AssessmentSubmissionController {

    private final AssessmentSubmissionService submissionService;
    private final AssessmentRepository assessmentRepository;
    private final AssessmentQuestionRepository questionRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public AssessmentSubmissionController(
            AssessmentSubmissionService submissionService,
            AssessmentRepository assessmentRepository,
            AssessmentQuestionRepository questionRepository,
            ApplicationRepository applicationRepository,
            UserRepository userRepository) {

        this.submissionService = submissionService;
        this.assessmentRepository = assessmentRepository;
        this.questionRepository = questionRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/submit")
    public ResponseEntity<AssessmentSubmissionResponse> submitAssessment(
            @RequestBody AssessmentSubmissionRequest request,
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

        Assessment assessment =
                assessmentRepository
                        .findById(request.getAssessmentId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Assessment not found"));

        List<Application> applications =
                applicationRepository
                        .findByCandidateId(candidate.getId());

        Application assignedApplication =
                applications.stream()
                        .filter(application ->
                                application.getAssessment() != null
                                        &&
                                application.getAssessment()
                                        .getId()
                                        .equals(assessment.getId()))
                        .findFirst()
                        .orElse(null);

        if (assignedApplication == null) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .build();
        }

        if (submissionService
                .findCandidateSubmission(
                        candidate.getId(),
                        assessment.getId())
                .isPresent()) {

            return ResponseEntity
                    .badRequest()
                    .build();
        }

        List<AssessmentQuestion> questions =
                questionRepository
                        .findByAssessmentId(
                                assessment.getId());

        Map<Long, String> answers =
                request.getAnswers();

        int score = 0;

        for (AssessmentQuestion question : questions) {

            String candidateAnswer =
                    answers.get(question.getId());

            if (candidateAnswer != null
                    &&
                    candidateAnswer.equalsIgnoreCase(
                            question.getCorrectAnswer())) {

                score++;
            }
        }

        int totalQuestions = questions.size();

        double percentage =
                totalQuestions > 0
                        ? ((double) score / totalQuestions) * 100
                        : 0.0;

        percentage =
                Math.round(percentage * 100.0) / 100.0;

        AssessmentSubmission submission =
                new AssessmentSubmission();

        submission.setCandidate(candidate);
        submission.setAssessment(assessment);
        submission.setScore(score);
        submission.setTotalQuestions(totalQuestions);
        submission.setPercentage(percentage);
        submission.setStatus("COMPLETED");

        AssessmentSubmission savedSubmission =
                submissionService
                        .createSubmission(submission);

        return ResponseEntity.ok(
                toResponse(savedSubmission)
        );
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