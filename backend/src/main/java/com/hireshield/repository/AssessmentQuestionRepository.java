package com.hireshield.repository;

import com.hireshield.model.AssessmentQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssessmentQuestionRepository
        extends JpaRepository<AssessmentQuestion, Long> {

    List<AssessmentQuestion> findByAssessmentId(Long assessmentId);

    Optional<AssessmentQuestion> findByIdAndAssessmentId(
            Long id,
            Long assessmentId
    );
}