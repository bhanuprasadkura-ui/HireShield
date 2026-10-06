package com.hireshield.dto;

public class CandidateSkillResponse {

    private Long id;
    private Long skillId;
    private String skillName;
    private String category;
    private String proficiency;

    public CandidateSkillResponse() {
    }

    public CandidateSkillResponse(
            Long id,
            Long skillId,
            String skillName,
            String category,
            String proficiency) {

        this.id = id;
        this.skillId = skillId;
        this.skillName = skillName;
        this.category = category;
        this.proficiency = proficiency;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSkillId() {
        return skillId;
    }

    public void setSkillId(Long skillId) {
        this.skillId = skillId;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getProficiency() {
        return proficiency;
    }

    public void setProficiency(String proficiency) {
        this.proficiency = proficiency;
    }
}