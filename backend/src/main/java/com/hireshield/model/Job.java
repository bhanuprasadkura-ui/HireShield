package com.hireshield.model;

import jakarta.persistence.*;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String company;

    @Column(length = 3000)
    private String description;

    private String location;

    private String employmentType;

    private String requiredSkills;

    private String preferredSkills;

    private String eligibility;

    private Integer minimumExperience;

    private String salaryRange;

    @ManyToOne
    @JoinColumn(name = "recruiter_id", nullable = false)
    private User recruiter;

    public Job() {
    }

    public Job(
            String title,
            String company,
            String description,
            String location,
            String employmentType,
            String requiredSkills,
            String preferredSkills,
            String eligibility,
            Integer minimumExperience,
            String salaryRange,
            User recruiter) {

        this.title = title;
        this.company = company;
        this.description = description;
        this.location = location;
        this.employmentType = employmentType;
        this.requiredSkills = requiredSkills;
        this.preferredSkills = preferredSkills;
        this.eligibility = eligibility;
        this.minimumExperience = minimumExperience;
        this.salaryRange = salaryRange;
        this.recruiter = recruiter;
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

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(String employmentType) {
        this.employmentType = employmentType;
    }

    public String getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(String requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public String getPreferredSkills() {
        return preferredSkills;
    }

    public void setPreferredSkills(String preferredSkills) {
        this.preferredSkills = preferredSkills;
    }

    public String getEligibility() {
        return eligibility;
    }

    public void setEligibility(String eligibility) {
        this.eligibility = eligibility;
    }

    public Integer getMinimumExperience() {
        return minimumExperience;
    }

    public void setMinimumExperience(Integer minimumExperience) {
        this.minimumExperience = minimumExperience;
    }

    public String getSalaryRange() {
        return salaryRange;
    }

    public void setSalaryRange(String salaryRange) {
        this.salaryRange = salaryRange;
    }

    public User getRecruiter() {
        return recruiter;
    }

    public void setRecruiter(User recruiter) {
        this.recruiter = recruiter;
    }
}