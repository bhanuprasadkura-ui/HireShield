package com.hireshield.repository;

import com.hireshield.model.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssessmentRepository extends JpaRepository<Assessment, Long> {

    List<Assessment> findByRecruiterId(Long recruiterId);

    Optional<Assessment> findByIdAndRecruiterId(
            Long id,
            Long recruiterId
    );
}