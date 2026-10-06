package com.hireshield.service;

import com.hireshield.model.Education;
import com.hireshield.repository.EducationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EducationService {

    private final EducationRepository educationRepository;

    public EducationService(EducationRepository educationRepository) {
        this.educationRepository = educationRepository;
    }

    public Education createEducation(Education education) {
        return educationRepository.save(education);
    }

    public List<Education> getCandidateEducation(Long candidateId) {
        return educationRepository.findByCandidateId(candidateId);
    }

    public void deleteEducation(Long educationId, Long candidateId) {

        Education education = educationRepository
                .findByIdAndCandidateId(educationId, candidateId)
                .orElseThrow(() ->
                        new RuntimeException("Education not found"));

        educationRepository.delete(education);
    }
}