package com.hireshield.repository;

import com.hireshield.model.Certification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CertificationRepository extends JpaRepository<Certification, Long> {

    List<Certification> findByCandidateId(Long candidateId);

    Optional<Certification> findByIdAndCandidateId(Long id, Long candidateId);
}