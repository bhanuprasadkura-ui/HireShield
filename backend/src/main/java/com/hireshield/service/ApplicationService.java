package com.hireshield.service;

import com.hireshield.model.Application;
import com.hireshield.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    public Application createApplication(Application application) {
        return applicationRepository.save(application);
    }

    public List<Application> getCandidateApplications(Long candidateId) {
        return applicationRepository.findByCandidateId(candidateId);
    }

    public List<Application> getJobApplications(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    public Optional<Application> findApplication(
            Long candidateId,
            Long jobId) {

        return applicationRepository
                .findByCandidateIdAndJobId(candidateId, jobId);
    }

    public Application findApplicationById(Long applicationId) {

        return applicationRepository
                .findById(applicationId)
                .orElseThrow(() ->
                        new RuntimeException("Application not found"));
    }

    public boolean alreadyApplied(
            Long candidateId,
            Long jobId) {

        return applicationRepository
                .existsByCandidateIdAndJobId(candidateId, jobId);
    }

    public Application updateApplication(Application application) {
        return applicationRepository.save(application);
    }
}