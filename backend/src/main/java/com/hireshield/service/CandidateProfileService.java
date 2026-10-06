package com.hireshield.service;

import com.hireshield.model.CandidateProfile;
import com.hireshield.repository.CandidateProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CandidateProfileService {

    private final CandidateProfileRepository candidateProfileRepository;

    public CandidateProfileService(
            CandidateProfileRepository candidateProfileRepository) {
        this.candidateProfileRepository = candidateProfileRepository;
    }

    public CandidateProfile createProfile(CandidateProfile profile) {
        return candidateProfileRepository.save(profile);
    }

    public Optional<CandidateProfile> getProfileByUserId(Long userId) {
        return candidateProfileRepository.findByUserId(userId);
    }

    public boolean profileExists(Long userId) {
        return candidateProfileRepository.existsByUserId(userId);
    }

    public CandidateProfile updateProfile(CandidateProfile profile) {
        return candidateProfileRepository.save(profile);
    }
}