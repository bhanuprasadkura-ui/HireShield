package com.hireshield.controller;

import com.hireshield.dto.JobMatchResponse;
import com.hireshield.model.CandidateSkill;
import com.hireshield.model.Job;
import com.hireshield.model.User;
import com.hireshield.repository.CandidateSkillRepository;
import com.hireshield.repository.JobRepository;
import com.hireshield.repository.UserRepository;
import com.hireshield.service.JobMatchService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5500")
public class JobMatchController {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final CandidateSkillRepository candidateSkillRepository;
    private final JobMatchService jobMatchService;

    public JobMatchController(
            JobRepository jobRepository,
            UserRepository userRepository,
            CandidateSkillRepository candidateSkillRepository,
            JobMatchService jobMatchService) {

        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.candidateSkillRepository = candidateSkillRepository;
        this.jobMatchService = jobMatchService;
    }

    @GetMapping("/{jobId}/match")
    public ResponseEntity<JobMatchResponse> getJobMatch(
            @PathVariable Long jobId,
            Authentication authentication) {

        String email = authentication.getName();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        double matchScore =
                jobMatchService.calculateMatchScore(
                        candidate.getId(),
                        job);

        List<String> missingSkills =
                jobMatchService.findMissingSkills(
                        candidate.getId(),
                        job);

        List<CandidateSkill> candidateSkills =
                candidateSkillRepository.findByCandidateId(
                        candidate.getId());

        Set<String> candidateSkillNames =
                candidateSkills.stream()
                        .map(skill ->
                                skill.getSkill()
                                        .getName()
                                        .trim()
                                        .toLowerCase())
                        .collect(Collectors.toSet());

        List<String> matchedSkills =
                Arrays.stream(job.getRequiredSkills().split(","))
                        .map(String::trim)
                        .filter(skill -> !skill.isBlank())
                        .filter(skill ->
                                candidateSkillNames.contains(
                                        skill.toLowerCase()))
                        .toList();

        JobMatchResponse response =
                new JobMatchResponse(
                        matchScore,
                        matchedSkills,
                        missingSkills
                );

        return ResponseEntity.ok(response);
    }
}