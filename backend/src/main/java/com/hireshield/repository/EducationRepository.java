package com.hireshield.repository;

import com.hireshield.model.Education;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EducationRepository extends JpaRepository<Education, Long> {

    List<Education> findByCandidateId(Long candidateId);

    Optional<Education> findByIdAndCandidateId(Long id, Long candidateId);
}