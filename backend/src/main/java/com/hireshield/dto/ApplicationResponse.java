package com.hireshield.dto;

public class ApplicationResponse {

    private Long id;
    private Long jobId;
    private String jobTitle;
    private String company;

    private Long candidateId;
    private String candidateName;
    private String candidateEmail;

    private String status;
    private Double matchScore;
    private String skillGap;

    private Long assessmentId;
    private String assessmentTitle;

    public ApplicationResponse() {
    }

    public ApplicationResponse(
            Long id,
            Long jobId,
            String jobTitle,
            String company,
            Long candidateId,
            String candidateName,
            String candidateEmail,
            String status,
            Double matchScore,
            String skillGap,
            Long assessmentId,
            String assessmentTitle) {

        this.id = id;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.company = company;
        this.candidateId = candidateId;
        this.candidateName = candidateName;
        this.candidateEmail = candidateEmail;
        this.status = status;
        this.matchScore = matchScore;
        this.skillGap = skillGap;
        this.assessmentId = assessmentId;
        this.assessmentTitle = assessmentTitle;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public Long getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Long candidateId) {
        this.candidateId = candidateId;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public String getCandidateEmail() {
        return candidateEmail;
    }

    public void setCandidateEmail(String candidateEmail) {
        this.candidateEmail = candidateEmail;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(Double matchScore) {
        this.matchScore = matchScore;
    }

    public String getSkillGap() {
        return skillGap;
    }

    public void setSkillGap(String skillGap) {
        this.skillGap = skillGap;
    }

    public Long getAssessmentId() {
        return assessmentId;
    }

    public void setAssessmentId(Long assessmentId) {
        this.assessmentId = assessmentId;
    }

    public String getAssessmentTitle() {
        return assessmentTitle;
    }

    public void setAssessmentTitle(String assessmentTitle) {
        this.assessmentTitle = assessmentTitle;
    }
}