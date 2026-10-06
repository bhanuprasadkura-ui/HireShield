package com.hireshield.service;

import com.hireshield.model.CandidateSkill;
import com.hireshield.repository.CandidateSkillRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CandidateSkillService {

    private final CandidateSkillRepository candidateSkillRepository;

    public CandidateSkillService(
            CandidateSkillRepository candidateSkillRepository) {

        this.candidateSkillRepository = candidateSkillRepository;
    }

    public CandidateSkill addSkill(CandidateSkill candidateSkill) {
        return candidateSkillRepository.save(candidateSkill);
    }

    public List<CandidateSkill> getCandidateSkills(Long candidateId) {
        return candidateSkillRepository.findByCandidateId(candidateId);
    }

    public boolean skillAlreadyAdded(
            Long candidateId,
            Long skillId) {

        return candidateSkillRepository
                .existsByCandidateIdAndSkillId(
                        candidateId,
                        skillId
                );
    }
}