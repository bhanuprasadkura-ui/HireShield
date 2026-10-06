package com.hireshield.service;

import com.hireshield.model.Assessment;
import com.hireshield.repository.AssessmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;

    public AssessmentService(
            AssessmentRepository assessmentRepository) {

        this.assessmentRepository = assessmentRepository;
    }

    public Assessment createAssessment(Assessment assessment) {
        return assessmentRepository.save(assessment);
    }

    public List<Assessment> getRecruiterAssessments(
            Long recruiterId) {

        return assessmentRepository.findByRecruiterId(
                recruiterId);
    }

    public List<Assessment> getAllAssessments() {
        return assessmentRepository.findAll();
    }

    public Optional<Assessment> findAssessment(
            Long assessmentId) {

        return assessmentRepository.findById(assessmentId);
    }

    public Optional<Assessment> findRecruiterAssessment(
            Long assessmentId,
            Long recruiterId) {

        return assessmentRepository
                .findByIdAndRecruiterId(
                        assessmentId,
                        recruiterId);
    }

    public Assessment updateAssessment(
            Assessment assessment) {

        return assessmentRepository.save(assessment);
    }

    public void deleteAssessment(
            Long assessmentId,
            Long recruiterId) {

        Assessment assessment =
                assessmentRepository
                        .findByIdAndRecruiterId(
                                assessmentId,
                                recruiterId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Assessment not found"));

        assessmentRepository.delete(assessment);
    }
}