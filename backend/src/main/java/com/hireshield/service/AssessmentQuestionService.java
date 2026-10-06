package com.hireshield.service;

import com.hireshield.model.AssessmentQuestion;
import com.hireshield.repository.AssessmentQuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AssessmentQuestionService {

    private final AssessmentQuestionRepository questionRepository;

    public AssessmentQuestionService(
            AssessmentQuestionRepository questionRepository) {

        this.questionRepository = questionRepository;
    }

    public AssessmentQuestion createQuestion(
            AssessmentQuestion question) {

        return questionRepository.save(question);
    }

    public List<AssessmentQuestion> getQuestionsByAssessment(
            Long assessmentId) {

        return questionRepository
                .findByAssessmentId(assessmentId);
    }

    public Optional<AssessmentQuestion> findQuestion(
            Long questionId) {

        return questionRepository.findById(questionId);
    }

    public Optional<AssessmentQuestion> findQuestionInAssessment(
            Long questionId,
            Long assessmentId) {

        return questionRepository
                .findByIdAndAssessmentId(
                        questionId,
                        assessmentId);
    }

    public AssessmentQuestion updateQuestion(
            AssessmentQuestion question) {

        return questionRepository.save(question);
    }

    public void deleteQuestion(Long questionId) {

        AssessmentQuestion question =
                questionRepository.findById(questionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Question not found"));

        questionRepository.delete(question);
    }
}