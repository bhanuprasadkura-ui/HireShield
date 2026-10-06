package com.hireshield.service;

import com.hireshield.model.Certification;
import com.hireshield.repository.CertificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CertificationService {

    private final CertificationRepository certificationRepository;

    public CertificationService(CertificationRepository certificationRepository) {
        this.certificationRepository = certificationRepository;
    }

    public Certification createCertification(Certification certification) {
        return certificationRepository.save(certification);
    }

    public List<Certification> getCandidateCertifications(Long candidateId) {
        return certificationRepository.findByCandidateId(candidateId);
    }

    public void deleteCertification(Long certificationId, Long candidateId) {

        Certification certification = certificationRepository
                .findByIdAndCandidateId(certificationId, candidateId)
                .orElseThrow(() ->
                        new RuntimeException("Certification not found"));

        certificationRepository.delete(certification);
    }
}