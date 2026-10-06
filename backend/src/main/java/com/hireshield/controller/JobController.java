package com.hireshield.controller;

import com.hireshield.dto.JobResponse;
import com.hireshield.model.Job;
import com.hireshield.model.User;
import com.hireshield.repository.UserRepository;
import com.hireshield.service.JobService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5500")
public class JobController {

    private final JobService jobService;
    private final UserRepository userRepository;

    public JobController(
            JobService jobService,
            UserRepository userRepository) {

        this.jobService = jobService;
        this.userRepository = userRepository;
    }

    // ==========================================
    // RECRUITER: CREATE JOB
    // ==========================================

    @PostMapping
    public ResponseEntity<JobResponse> createJob(
            @RequestBody Job job,
            Authentication authentication) {

        String email = authentication.getName();

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Only recruiters can create jobs
        if (!"RECRUITER".equals(recruiter.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        job.setRecruiter(recruiter);

        Job savedJob = jobService.createJob(job);

        return ResponseEntity.ok(toResponse(savedJob));
    }

    // ==========================================
    // CANDIDATE: VIEW ALL JOBS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<JobResponse>> getAllJobs() {

        List<JobResponse> response =
                jobService.getAllJobs()
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // RECRUITER: VIEW MY JOBS
    // ==========================================

    @GetMapping("/my-jobs")
    public ResponseEntity<List<JobResponse>> getMyJobs(
            Authentication authentication) {

        String email = authentication.getName();

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Only recruiters can view their own jobs
        if (!"RECRUITER".equals(recruiter.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<JobResponse> response =
                jobService.getRecruiterJobs(recruiter.getId())
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // RECRUITER: DELETE OWN JOB
    // ==========================================

    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> deleteJob(
            @PathVariable Long jobId,
            Authentication authentication) {

        String email = authentication.getName();

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Only recruiters can delete jobs
        if (!"RECRUITER".equals(recruiter.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // JobService already checks that the job belongs
        // to this recruiter.
        jobService.deleteJob(
                jobId,
                recruiter.getId()
        );

        return ResponseEntity.noContent().build();
    }

    // ==========================================
    // CONVERT JOB TO RESPONSE
    // ==========================================

    private JobResponse toResponse(Job job) {

        return new JobResponse(
                job.getId(),
                job.getTitle(),
                job.getCompany(),
                job.getDescription(),
                job.getLocation(),
                job.getEmploymentType(),
                job.getRequiredSkills(),
                job.getPreferredSkills(),
                job.getEligibility(),
                job.getMinimumExperience(),
                job.getSalaryRange()
        );
    }
}