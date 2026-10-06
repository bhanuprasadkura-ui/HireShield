package com.hireshield.dto;

public class CandidateProfileResponse {

    private Long id;
    private String phone;
    private String location;
    private String bio;
    private String resumeUrl;
    private String linkedinUrl;
    private String githubUrl;
    private Integer yearsOfExperience;

    public CandidateProfileResponse() {
    }

    public CandidateProfileResponse(
            Long id,
            String phone,
            String location,
            String bio,
            String resumeUrl,
            String linkedinUrl,
            String githubUrl,
            Integer yearsOfExperience) {

        this.id = id;
        this.phone = phone;
        this.location = location;
        this.bio = bio;
        this.resumeUrl = resumeUrl;
        this.linkedinUrl = linkedinUrl;
        this.githubUrl = githubUrl;
        this.yearsOfExperience = yearsOfExperience;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }
}