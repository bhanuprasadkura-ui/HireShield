package com.hireshield.dto;

import java.util.List;

public class CandidateAssessmentResponse {

    private Long assessmentId;
    private String title;
    private String description;
    private String duration;
    private Integer totalQuestions;
    private List<AssessmentQuestionResponse> questions;

    public CandidateAssessmentResponse() {
    }

    public CandidateAssessmentResponse(
            Long assessmentId,
            String title,
            String description,
            String duration,
            Integer totalQuestions,
            List<AssessmentQuestionResponse> questions) {

        this.assessmentId = assessmentId;
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.totalQuestions = totalQuestions;
        this.questions = questions;
    }

    public Long getAssessmentId() {
        return assessmentId;
    }

    public void setAssessmentId(Long assessmentId) {
        this.assessmentId = assessmentId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public List<AssessmentQuestionResponse> getQuestions() {
        return questions;
    }

    public void setQuestions(
            List<AssessmentQuestionResponse> questions) {

        this.questions = questions;
    }
}