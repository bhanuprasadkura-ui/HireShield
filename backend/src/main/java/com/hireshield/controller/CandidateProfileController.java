package com.hireshield.controller;

import com.hireshield.dto.CandidateProfileResponse;
import com.hireshield.model.CandidateProfile;
import com.hireshield.model.User;
import com.hireshield.repository.UserRepository;
import com.hireshield.service.CandidateProfileService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/candidate/profile")
@CrossOrigin(origins = "http://localhost:5500")
public class CandidateProfileController {

    private final CandidateProfileService candidateProfileService;
    private final UserRepository userRepository;

    public CandidateProfileController(
            CandidateProfileService candidateProfileService,
            UserRepository userRepository) {

        this.candidateProfileService = candidateProfileService;
        this.userRepository = userRepository;
    }


    /* =========================================
       CREATE PROFILE
    ========================================= */

    @PostMapping
    public ResponseEntity<CandidateProfileResponse> createProfile(
            @RequestBody CandidateProfile profile,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (candidateProfileService.profileExists(user.getId())) {

            return ResponseEntity
                    .badRequest()
                    .build();
        }

        profile.setUser(user);

        CandidateProfile savedProfile =
                candidateProfileService.createProfile(profile);

        return ResponseEntity.ok(
                toResponse(savedProfile)
        );
    }


    /* =========================================
       GET MY PROFILE
    ========================================= */

    @GetMapping
    public ResponseEntity<CandidateProfileResponse> getProfile(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return candidateProfileService
                .getProfileByUserId(user.getId())

                .map(profile ->
                        ResponseEntity.ok(
                                toResponse(profile)
                        )
                )

                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }


    /* =========================================
       CONVERT ENTITY TO RESPONSE
    ========================================= */

    private CandidateProfileResponse toResponse(
            CandidateProfile profile) {

        return new CandidateProfileResponse(
                profile.getId(),
                profile.getPhone(),
                profile.getLocation(),
                profile.getBio(),
                profile.getResumeUrl(),
                profile.getLinkedinUrl(),
                profile.getGithubUrl(),
                profile.getYearsOfExperience()
        );
    }
}