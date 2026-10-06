package com.hireshield.dto;

public class AssessmentResponse {

    private Long id;
    private String title;
    private String description;
    private String duration;
    private Integer totalQuestions;
    private Long recruiterId;

    public AssessmentResponse() {
    }

    public AssessmentResponse(
            Long id,
            String title,
            String description,
            String duration,
            Integer totalQuestions,
            Long recruiterId) {

        this.id = id;
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.totalQuestions = totalQuestions;
        this.recruiterId = recruiterId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Long getRecruiterId() {
        return recruiterId;
    }

    public void setRecruiterId(Long recruiterId) {
        this.recruiterId = recruiterId;
    }
}