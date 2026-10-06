package com.hireshield.repository;

import com.hireshield.model.AssessmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssessmentSubmissionRepository
        extends JpaRepository<AssessmentSubmission, Long> {

    List<AssessmentSubmission> findByCandidateId(Long candidateId);

    List<AssessmentSubmission> findByAssessmentId(Long assessmentId);

    Optional<AssessmentSubmission> findByCandidateIdAndAssessmentId(
            Long candidateId,
            Long assessmentId
    );
}