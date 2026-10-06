package com.hireshield.controller;

import com.hireshield.model.Skill;
import com.hireshield.service.SkillService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = "http://localhost:5500")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @PostMapping
    public ResponseEntity<Skill> createSkill(
            @RequestBody Skill skill) {

        if (skillService.skillExists(skill.getName())) {
            return ResponseEntity.badRequest().build();
        }

        Skill savedSkill = skillService.createSkill(skill);

        return ResponseEntity.ok(savedSkill);
    }

    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills() {

        return ResponseEntity.ok(
                skillService.getAllSkills()
        );
    }
}