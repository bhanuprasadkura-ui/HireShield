package com.hireshield.dto;

import java.util.Map;

public class AssessmentSubmissionRequest {

    private Long assessmentId;

    private Map<Long, String> answers;

    public AssessmentSubmissionRequest() {
    }

    public AssessmentSubmissionRequest(
            Long assessmentId,
            Map<Long, String> answers) {

        this.assessmentId = assessmentId;
        this.answers = answers;
    }

    public Long getAssessmentId() {
        return assessmentId;
    }

    public void setAssessmentId(Long assessmentId) {
        this.assessmentId = assessmentId;
    }

    public Map<Long, String> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<Long, String> answers) {
        this.answers = answers;
    }
}