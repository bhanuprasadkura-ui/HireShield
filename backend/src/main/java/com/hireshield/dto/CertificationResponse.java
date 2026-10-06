package com.hireshield.dto;

public class CertificationResponse {

    private Long id;
    private String name;
    private String issuingOrganization;
    private String issueDate;
    private String credentialId;
    private String credentialUrl;

    public CertificationResponse() {
    }

    public CertificationResponse(
            Long id,
            String name,
            String issuingOrganization,
            String issueDate,
            String credentialId,
            String credentialUrl) {

        this.id = id;
        this.name = name;
        this.issuingOrganization = issuingOrganization;
        this.issueDate = issueDate;
        this.credentialId = credentialId;
        this.credentialUrl = credentialUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIssuingOrganization() {
        return issuingOrganization;
    }

    public void setIssuingOrganization(String issuingOrganization) {
        this.issuingOrganization = issuingOrganization;
    }

    public String getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(String issueDate) {
        this.issueDate = issueDate;
    }

    public String getCredentialId() {
        return credentialId;
    }

    public void setCredentialId(String credentialId) {
        this.credentialId = credentialId;
    }

    public String getCredentialUrl() {
        return credentialUrl;
    }

    public void setCredentialUrl(String credentialUrl) {
        this.credentialUrl = credentialUrl;
    }
}