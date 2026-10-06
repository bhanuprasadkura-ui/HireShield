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

@RestController
@RequestMapping("/api/candidate/skills")
@CrossOrigin(origins = "http://localhost:5500")
public class CandidateSkillController {

    private final CandidateSkillService candidateSkillService;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

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

        String email = authentication.getName();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() ->
                        new RuntimeException("Skill not found"));

        if (candidateSkillService.skillAlreadyAdded(
                candidate.getId(),
                skillId)) {

            return ResponseEntity.badRequest().build();
        }

        CandidateSkill candidateSkill =
                new CandidateSkill(
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

        String email = authentication.getName();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<CandidateSkillResponse> response =
                candidateSkillService
                        .getCandidateSkills(candidate.getId())
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(response);
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