package com.hireshield.controller;

import com.hireshield.dto.CertificationResponse;
import com.hireshield.model.Certification;
import com.hireshield.model.User;
import com.hireshield.repository.UserRepository;
import com.hireshield.service.CertificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidate/certifications")
@CrossOrigin(origins = "http://localhost:5500")
public class CertificationController {

    private final CertificationService certificationService;
    private final UserRepository userRepository;

    public CertificationController(
            CertificationService certificationService,
            UserRepository userRepository) {

        this.certificationService = certificationService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<CertificationResponse> createCertification(
            @RequestBody Certification certification,
            Authentication authentication) {

        String email = authentication.getName();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        certification.setCandidate(candidate);

        Certification savedCertification =
                certificationService.createCertification(certification);

        return ResponseEntity.ok(
                toResponse(savedCertification)
        );
    }

    @GetMapping
    public ResponseEntity<List<CertificationResponse>> getMyCertifications(
            Authentication authentication) {

        String email = authentication.getName();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<CertificationResponse> response =
                certificationService
                        .getCandidateCertifications(candidate.getId())
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{certificationId}")
    public ResponseEntity<Void> deleteCertification(
            @PathVariable Long certificationId,
            Authentication authentication) {

        String email = authentication.getName();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        certificationService.deleteCertification(
                certificationId,
                candidate.getId()
        );

        return ResponseEntity.noContent().build();
    }

    private CertificationResponse toResponse(
            Certification certification) {

        return new CertificationResponse(
                certification.getId(),
                certification.getName(),
                certification.getIssuingOrganization(),
                certification.getIssueDate(),
                certification.getCredentialId(),
                certification.getCredentialUrl()
        );
    }
}