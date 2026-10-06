package com.hireshield.dto;

public class AssessmentSubmissionResponse {

    private Long id;
    private Long assessmentId;
    private String assessmentTitle;

    private Long candidateId;
    private String candidateName;
    private String candidateEmail;

    private int score;
    private int totalQuestions;
    private double percentage;
    private String status;

    public AssessmentSubmissionResponse() {
    }

    public AssessmentSubmissionResponse(
            Long id,
            Long assessmentId,
            String assessmentTitle,
            Long candidateId,
            String candidateName,
            String candidateEmail,
            int score,
            int totalQuestions,
            double percentage,
            String status) {

        this.id = id;
        this.assessmentId = assessmentId;
        this.assessmentTitle = assessmentTitle;
        this.candidateId = candidateId;
        this.candidateName = candidateName;
        this.candidateEmail = candidateEmail;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.percentage = percentage;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}