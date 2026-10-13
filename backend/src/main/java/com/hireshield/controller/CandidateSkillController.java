
package com.hireshield.controller;

import com.hireshield.dto.CandidateSkillResponse;
import com.hireshield.model.CandidateSkill;
import com.hireshield.model.Skill;
import com.hireshield.model.User;
import com.hireshield.repository.SkillRepository;
import com.hireshield.repository.UserRepository;
import com.hireshield.service.CandidateSkillService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/candidate/skills")
@CrossOrigin(origins = "http://localhost:5500")
public class CandidateSkillController {

    private final CandidateSkillService candidateSkillService;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

    private static final Set<String> VALID_PROFICIENCIES =
            Set.of("Beginner", "Intermediate", "Advanced", "Expert");

    public CandidateSkillController(
            CandidateSkillService candidateSkillService,
            UserRepository userRepository,
            SkillRepository skillRepository) {

        this.candidateSkillService = candidateSkillService;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
    }

    @PostMapping("/{skillId}")
    public ResponseEntity<CandidateSkillResponse> addSkill(
            @PathVariable Long skillId,
            @RequestParam String proficiency,
            Authentication authentication) {

        if (!isValidProficiency(proficiency)) {
            return ResponseEntity.badRequest().build();
        }

        User candidate = getAuthenticatedCandidate(authentication);

        if (candidate == null) {
            return ResponseEntity.status(401).build();
        }

        Skill skill = skillRepository.findById(skillId)
                .orElse(null);

        if (skill == null) {
            return ResponseEntity.notFound().build();
        }

        if (candidateSkillService.skillAlreadyAdded(
                candidate.getId(), skill.getId())) {
            return ResponseEntity.badRequest().build();
        }

        CandidateSkill candidateSkill = new CandidateSkill(
                candidate,
                skill,
                proficiency
        );

        CandidateSkill savedSkill =
                candidateSkillService.addSkill(candidateSkill);

        return ResponseEntity.ok(toResponse(savedSkill));
    }

    @PostMapping("/custom")
    public ResponseEntity<CandidateSkillResponse> addCustomSkill(
            @RequestParam String skillName,
            @RequestParam String proficiency,
            Authentication authentication) {

        if (skillName == null || skillName.isBlank()
                || skillName.trim().length() > 100
                || !isValidProficiency(proficiency)) {
            return ResponseEntity.badRequest().build();
        }

        User candidate = getAuthenticatedCandidate(authentication);

        if (candidate == null) {
            return ResponseEntity.status(401).build();
        }

        String normalizedName = skillName.trim();

        Skill skill = skillRepository
                .findByNameIgnoreCase(normalizedName)
                .orElseGet(() -> skillRepository.save(
                        new Skill(normalizedName, "Custom")
                ));

        if (candidateSkillService.skillAlreadyAdded(
                candidate.getId(), skill.getId())) {
            return ResponseEntity.badRequest().build();
        }

        CandidateSkill candidateSkill = new CandidateSkill(
                candidate,
                skill,
                proficiency
        );

        CandidateSkill savedSkill =
                candidateSkillService.addSkill(candidateSkill);

        return ResponseEntity.ok(toResponse(savedSkill));
    }

    @GetMapping
    public ResponseEntity<List<CandidateSkillResponse>> getMySkills(
            Authentication authentication) {

        User candidate = getAuthenticatedCandidate(authentication);

        if (candidate == null) {
            return ResponseEntity.status(401).build();
        }

        List<CandidateSkillResponse> response =
                candidateSkillService
                        .getCandidateSkills(candidate.getId())
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    private User getAuthenticatedCandidate(
            Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()) {
            return null;
        }

        return userRepository.findByEmail(authentication.getName())
                .orElse(null);
    }

    private boolean isValidProficiency(String proficiency) {
        return proficiency != null
                && VALID_PROFICIENCIES.contains(proficiency);
    }

    private CandidateSkillResponse toResponse(
            CandidateSkill candidateSkill) {

        return new CandidateSkillResponse(
                candidateSkill.getId(),
                candidateSkill.getSkill().getId(),
                candidateSkill.getSkill().getName(),
                candidateSkill.getSkill().getCategory(),
                candidateSkill.getProficiency()
        );
    }
}
