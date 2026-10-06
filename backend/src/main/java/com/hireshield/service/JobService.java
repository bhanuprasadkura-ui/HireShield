package com.hireshield.service;

import com.hireshield.model.Job;
import com.hireshield.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

    public List<Job> getRecruiterJobs(Long recruiterId) {
        return jobRepository.findByRecruiterId(recruiterId);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public void deleteJob(Long jobId, Long recruiterId) {

        Job job = jobRepository
                .findByIdAndRecruiterId(jobId, recruiterId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        jobRepository.delete(job);
    }
}