package com.hireshield.dto;

import java.util.List;

public class SkillGapResponse {

    private Long jobId;
    private String jobTitle;
    private double matchScore;
    private List<String> matchedSkills;
    private List<String> missingSkills;

    public SkillGapResponse() {
    }

    public SkillGapResponse(
            Long jobId,
            String jobTitle,
            double matchScore,
            List<String> matchedSkills,
            List<String> missingSkills) {

        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.matchScore = matchScore;
        this.matchedSkills = matchedSkills;
        this.missingSkills = missingSkills;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public double getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(double matchScore) {
        this.matchScore = matchScore;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }
}