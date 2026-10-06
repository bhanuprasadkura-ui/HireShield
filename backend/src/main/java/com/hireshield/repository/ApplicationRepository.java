package com.hireshield.repository;

import com.hireshield.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository
        extends JpaRepository<Application, Long> {

    List<Application> findByCandidateId(Long candidateId);

    List<Application> findByJobId(Long jobId);

    Optional<Application> findByCandidateIdAndJobId(
            Long candidateId,
            Long jobId);

    Optional<Application> findByCandidateIdAndAssessmentId(
            Long candidateId,
            Long assessmentId);

    boolean existsByCandidateIdAndJobId(
            Long candidateId,
            Long jobId);
}