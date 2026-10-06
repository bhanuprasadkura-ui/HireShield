package com.hireshield.controller;

import com.hireshield.dto.ApplicationResponse;
import com.hireshield.model.Application;
import com.hireshield.model.User;
import com.hireshield.repository.UserRepository;
import com.hireshield.service.ApplicationService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/candidate/applications")
@CrossOrigin(origins = "http://localhost:5500")
public class CandidateApplicationController {

    private final ApplicationService applicationService;
    private final UserRepository userRepository;

    public CandidateApplicationController(
            ApplicationService applicationService,
            UserRepository userRepository) {

        this.applicationService = applicationService;
        this.userRepository = userRepository;
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<ApplicationResponse> getMyApplication(
            @PathVariable Long applicationId,
            Authentication authentication) {

        String email = authentication.getName();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Application application =
                applicationService
                        .findApplicationById(applicationId);

        if (!application.getCandidate()
                .getId()
                .equals(candidate.getId())) {

            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(
                toResponse(application)
        );
    }

    private ApplicationResponse toResponse(
            Application application) {

        Long assessmentId = null;
        String assessmentTitle = null;

        if (application.getAssessment() != null) {

            assessmentId =
                    application.getAssessment().getId();

            assessmentTitle =
                    application.getAssessment().getTitle();
        }

        return new ApplicationResponse(
                application.getId(),
                application.getJob().getId(),
                application.getJob().getTitle(),
                application.getJob().getCompany(),
                application.getCandidate().getId(),
                application.getCandidate().getName(),
                application.getCandidate().getEmail(),
                application.getStatus(),
                application.getMatchScore(),
                application.getSkillGap(),
                assessmentId,
                assessmentTitle
        );
    }
}