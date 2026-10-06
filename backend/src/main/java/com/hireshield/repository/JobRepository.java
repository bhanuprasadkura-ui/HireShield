package com.hireshield.repository;

import com.hireshield.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByRecruiterId(Long recruiterId);

    Optional<Job> findByIdAndRecruiterId(Long id, Long recruiterId);
}