package com.hireshield.service;

import com.hireshield.model.AssessmentSubmission;
import com.hireshield.repository.AssessmentSubmissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AssessmentSubmissionService {

    private final AssessmentSubmissionRepository submissionRepository;

    public AssessmentSubmissionService(
            AssessmentSubmissionRepository submissionRepository) {

        this.submissionRepository = submissionRepository;
    }

    public AssessmentSubmission createSubmission(
            AssessmentSubmission submission) {

        return submissionRepository.save(submission);
    }

    public List<AssessmentSubmission> getCandidateSubmissions(
            Long candidateId) {

        return submissionRepository
                .findByCandidateId(candidateId);
    }

    public List<AssessmentSubmission> getAssessmentSubmissions(
            Long assessmentId) {

        return submissionRepository
                .findByAssessmentId(assessmentId);
    }

    public Optional<AssessmentSubmission> findSubmission(
            Long submissionId) {

        return submissionRepository.findById(submissionId);
    }

    public Optional<AssessmentSubmission> findCandidateSubmission(
            Long candidateId,
            Long assessmentId) {

        return submissionRepository
                .findByCandidateIdAndAssessmentId(
                        candidateId,
                        assessmentId);
    }
}