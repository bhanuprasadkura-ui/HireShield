package com.hireshield.service;

import com.hireshield.model.Skill;
import com.hireshield.repository.SkillRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public Skill createSkill(Skill skill) {
        return skillRepository.save(skill);
    }

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    public Optional<Skill> findByName(String name) {
        return skillRepository.findByNameIgnoreCase(name);
    }

    public boolean skillExists(String name) {
        return skillRepository.existsByNameIgnoreCase(name);
    }
}