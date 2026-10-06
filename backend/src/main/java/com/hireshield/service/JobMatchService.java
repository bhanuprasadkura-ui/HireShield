package com.hireshield.service;

import com.hireshield.model.CandidateSkill;
import com.hireshield.model.Job;
import com.hireshield.repository.CandidateSkillRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class JobMatchService {

    private final CandidateSkillRepository candidateSkillRepository;

    public JobMatchService(
            CandidateSkillRepository candidateSkillRepository) {

        this.candidateSkillRepository = candidateSkillRepository;
    }

    public double calculateMatchScore(Long candidateId, Job job) {

        if (job.getRequiredSkills() == null ||
                job.getRequiredSkills().isBlank()) {

            return 0.0;
        }

        List<String> requiredSkills =
                Arrays.stream(job.getRequiredSkills().split(","))
                        .map(String::trim)
                        .map(String::toLowerCase)
                        .filter(skill -> !skill.isBlank())
                        .toList();

        if (requiredSkills.isEmpty()) {
            return 0.0;
        }

        List<CandidateSkill> candidateSkills =
                candidateSkillRepository.findByCandidateId(candidateId);

        Set<String> candidateSkillNames =
                candidateSkills.stream()
                        .map(candidateSkill ->
                                candidateSkill.getSkill()
                                        .getName()
                                        .trim()
                                        .toLowerCase())
                        .collect(Collectors.toSet());

        long matchedSkills =
                requiredSkills.stream()
                        .filter(candidateSkillNames::contains)
                        .count();

        return Math.round(
                ((double) matchedSkills / requiredSkills.size()) * 10000
        ) / 100.0;
    }

    public List<String> findMissingSkills(
            Long candidateId,
            Job job) {

        if (job.getRequiredSkills() == null ||
                job.getRequiredSkills().isBlank()) {

            return new ArrayList<>();
        }

        List<String> requiredSkills =
                Arrays.stream(job.getRequiredSkills().split(","))
                        .map(String::trim)
                        .filter(skill -> !skill.isBlank())
                        .toList();

        List<CandidateSkill> candidateSkills =
                candidateSkillRepository.findByCandidateId(candidateId);

        Set<String> candidateSkillNames =
                candidateSkills.stream()
                        .map(candidateSkill ->
                                candidateSkill.getSkill()
                                        .getName()
                                        .trim()
                                        .toLowerCase())
                        .collect(Collectors.toSet());

        return requiredSkills.stream()
                .filter(skill ->
                        !candidateSkillNames.contains(
                                skill.toLowerCase()))
                .toList();
    }
}