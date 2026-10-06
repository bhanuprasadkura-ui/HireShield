package com.hireshield.model;

import jakarta.persistence.*;

@Entity
@Table(
    name = "applications",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"candidate_id", "job_id"})
    }
)
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String status;

    private Double matchScore;

    @Column(length = 2000)
    private String skillGap;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne
    @JoinColumn(name = "assessment_id")
    private Assessment assessment;

    public Application() {
    }

    public Application(
            User candidate,
            Job job,
            String status,
            Double matchScore,
            String skillGap) {

        this.candidate = candidate;
        this.job = job;
        this.status = status;
        this.matchScore = matchScore;
        this.skillGap = skillGap;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public User getCandidate() {
        return candidate;
    }

    public void setCandidate(User candidate) {
        this.candidate = candidate;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public Assessment getAssessment() {
        return assessment;
    }

    public void setAssessment(Assessment assessment) {
        this.assessment = assessment;
    }
}