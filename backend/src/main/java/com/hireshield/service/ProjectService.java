package com.hireshield.service;

import com.hireshield.model.Project;
import com.hireshield.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public List<Project> getCandidateProjects(Long candidateId) {
        return projectRepository.findByCandidateId(candidateId);
    }

    public void deleteProject(Long projectId, Long candidateId) {

        Project project = projectRepository
                .findByIdAndCandidateId(projectId, candidateId)
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));

        projectRepository.delete(project);
    }
}