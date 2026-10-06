package com.hireshield.repository;

import com.hireshield.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByCandidateId(Long candidateId);

    Optional<Project> findByIdAndCandidateId(Long id, Long candidateId);
}