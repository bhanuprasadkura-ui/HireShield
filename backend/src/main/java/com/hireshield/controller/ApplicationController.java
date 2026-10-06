package com.hireshield.controller;

import com.hireshield.dto.ApplicationResponse;
import com.hireshield.model.Application;
import com.hireshield.model.Assessment;
import com.hireshield.model.Job;
import com.hireshield.model.User;
import com.hireshield.repository.JobRepository;
import com.hireshield.repository.UserRepository;
import com.hireshield.service.ApplicationService;
import com.hireshield.service.AssessmentService;
import com.hireshield.service.JobMatchService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5500")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final JobMatchService jobMatchService;
    private final AssessmentService assessmentService;

    public ApplicationController(
            ApplicationService applicationService,
            UserRepository userRepository,
            JobRepository jobRepository,
            JobMatchService jobMatchService,
            AssessmentService assessmentService) {

        this.applicationService = applicationService;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.jobMatchService = jobMatchService;
        this.assessmentService = assessmentService;
    }

    // ==========================================
    // CANDIDATE: APPLY FOR JOB
    // ==========================================

    @PostMapping("/apply/{jobId}")
    public ResponseEntity<ApplicationResponse> applyForJob(
            @PathVariable Long jobId,
            Authentication authentication) {

        String email = authentication.getName();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Only candidates can apply for jobs
        if (!"CANDIDATE".equals(candidate.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        if (applicationService.alreadyApplied(
                candidate.getId(),
                jobId)) {

            return ResponseEntity.badRequest().build();
        }

        double matchScore =
                jobMatchService.calculateMatchScore(
                        candidate.getId(),
                        job);

        List<String> missingSkills =
                jobMatchService.findMissingSkills(
                        candidate.getId(),
                        job);

        String skillGap =
                String.join(", ", missingSkills);

        Application application = new Application();

        application.setCandidate(candidate);
        application.setJob(job);
        application.setStatus("APPLIED");
        application.setMatchScore(matchScore);
        application.setSkillGap(skillGap);

        Application savedApplication =
                applicationService.createApplication(application);

        return ResponseEntity.ok(
                toResponse(savedApplication)
        );
    }

    // ==========================================
    // CANDIDATE: VIEW MY APPLICATIONS
    // ==========================================

    @GetMapping("/my-applications")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(
            Authentication authentication) {

        String email = authentication.getName();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Only candidates can view candidate applications
        if (!"CANDIDATE".equals(candidate.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<ApplicationResponse> response =
                applicationService
                        .getCandidateApplications(candidate.getId())
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // RECRUITER: VIEW JOB APPLICANTS
    // ==========================================

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationResponse>> getJobApplications(
            @PathVariable Long jobId,
            Authentication authentication) {

        String email = authentication.getName();

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Only recruiters can view applicants
        if (!"RECRUITER".equals(recruiter.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Job job = jobRepository.findByIdAndRecruiterId(
                jobId,
                recruiter.getId()
        ).orElseThrow(() ->
                new RuntimeException("Job not found"));

        List<ApplicationResponse> response =
                applicationService
                        .getJobApplications(job.getId())
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // RECRUITER: UPDATE APPLICATION STATUS
    // ==========================================

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<ApplicationResponse> updateStatus(
            @PathVariable Long applicationId,
            @RequestParam String status,
            Authentication authentication) {

        String email = authentication.getName();

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Only recruiters can update application status
        if (!"RECRUITER".equals(recruiter.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Application application =
                applicationService
                        .findApplicationById(applicationId);

        // Make sure this recruiter owns the job
        if (!application.getJob()
                .getRecruiter()
                .getId()
                .equals(recruiter.getId())) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        application.setStatus(status);

        Application updatedApplication =
                applicationService.updateApplication(application);

        return ResponseEntity.ok(
                toResponse(updatedApplication)
        );
    }

    // ==========================================
    // RECRUITER: ASSIGN ASSESSMENT
    // ==========================================

    @PutMapping("/{applicationId}/assessment/{assessmentId}")
    public ResponseEntity<ApplicationResponse> assignAssessment(
            @PathVariable Long applicationId,
            @PathVariable Long assessmentId,
            Authentication authentication) {

        String email = authentication.getName();

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Only recruiters can assign assessments
        if (!"RECRUITER".equals(recruiter.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Application application =
                applicationService
                        .findApplicationById(applicationId);

        // Make sure this recruiter owns the job
        if (!application.getJob()
                .getRecruiter()
                .getId()
                .equals(recruiter.getId())) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Assessment assessment =
                assessmentService
                        .findRecruiterAssessment(
                                assessmentId,
                                recruiter.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Assessment not found"));

        application.setAssessment(assessment);

        application.setStatus("ASSESSMENT");

        Application updatedApplication =
                applicationService.updateApplication(application);

        return ResponseEntity.ok(
                toResponse(updatedApplication)
        );
    }

    // ==========================================
    // CONVERT APPLICATION TO RESPONSE
    // ==========================================

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