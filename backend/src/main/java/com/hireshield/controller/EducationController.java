package com.hireshield.controller;

import com.hireshield.dto.EducationResponse;
import com.hireshield.model.Education;
import com.hireshield.model.User;
import com.hireshield.repository.UserRepository;
import com.hireshield.service.EducationService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidate/education")
@CrossOrigin(origins = "http://localhost:5500")
public class EducationController {

    private final EducationService educationService;
    private final UserRepository userRepository;

    public EducationController(
            EducationService educationService,
            UserRepository userRepository) {

        this.educationService = educationService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<EducationResponse> createEducation(
            @RequestBody Education education,
            Authentication authentication) {

        String email = authentication.getName();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        education.setCandidate(candidate);

        Education savedEducation =
                educationService.createEducation(education);

        return ResponseEntity.ok(
                toResponse(savedEducation)
        );
    }

    @GetMapping
    public ResponseEntity<List<EducationResponse>> getMyEducation(
            Authentication authentication) {

        String email = authentication.getName();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<EducationResponse> response =
                educationService
                        .getCandidateEducation(candidate.getId())
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{educationId}")
    public ResponseEntity<Void> deleteEducation(
            @PathVariable Long educationId,
            Authentication authentication) {

        String email = authentication.getName();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        educationService.deleteEducation(
                educationId,
                candidate.getId()
        );

        return ResponseEntity.noContent().build();
    }

    private EducationResponse toResponse(Education education) {

        return new EducationResponse(
                education.getId(),
                education.getDegree(),
                education.getInstitution(),
                education.getFieldOfStudy(),
                education.getStartDate(),
                education.getEndDate(),
                education.getPercentage(),
                education.getCgpa()
        );
    }
}