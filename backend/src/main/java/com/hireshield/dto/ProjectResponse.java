package com.hireshield.dto;

public class ProjectResponse {

    private Long id;
    private String title;
    private String description;
    private String technologies;
    private String projectUrl;
    private String githubUrl;

    public ProjectResponse() {
    }

    public ProjectResponse(
            Long id,
            String title,
            String description,
            String technologies,
            String projectUrl,
            String githubUrl) {

        this.id = id;
        this.title = title;
        this.description = description;
        this.technologies = technologies;
        this.projectUrl = projectUrl;
        this.githubUrl = githubUrl;
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

    public String getTechnologies() {
        return technologies;
    }

    public void setTechnologies(String technologies) {
        this.technologies = technologies;
    }

    public String getProjectUrl() {
        return projectUrl;
    }

    public void setProjectUrl(String projectUrl) {
        this.projectUrl = projectUrl;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }
}