package com.hireshield.model;

import jakarta.persistence.*;

@Entity
@Table(
    name = "candidate_skills",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"candidate_id", "skill_id"})
    }
)
public class CandidateSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    @ManyToOne
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    private String proficiency;

    public CandidateSkill() {
    }

    public CandidateSkill(
            User candidate,
            Skill skill,
            String proficiency) {

        this.candidate = candidate;
        this.skill = skill;
        this.proficiency = proficiency;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getCandidate() {
        return candidate;
    }

    public void setCandidate(User candidate) {
        this.candidate = candidate;
    }

    public Skill getSkill() {
        return skill;
    }

    public void setSkill(Skill skill) {
        this.skill = skill;
    }

    public String getProficiency() {
        return proficiency;
    }

    public void setProficiency(String proficiency) {
        this.proficiency = proficiency;
    }
}