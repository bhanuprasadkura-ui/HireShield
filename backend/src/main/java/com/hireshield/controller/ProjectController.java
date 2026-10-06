package com.hireshield.controller;

import com.hireshield.dto.ProjectResponse;
import com.hireshield.model.Project;
import com.hireshield.model.User;
import com.hireshield.repository.UserRepository;
import com.hireshield.service.ProjectService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidate/projects")
@CrossOrigin(origins = "http://localhost:5500")
public class ProjectController {

    private final ProjectService projectService;
    private final UserRepository userRepository;

    public ProjectController(
            ProjectService projectService,
            UserRepository userRepository) {

        this.projectService = projectService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @RequestBody Project project,
            Authentication authentication) {

        String email = authentication.getName();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        project.setCandidate(candidate);

        Project savedProject =
                projectService.createProject(project);

        return ResponseEntity.ok(
                toResponse(savedProject)
        );
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getMyProjects(
            Authentication authentication) {

        String email = authentication.getName();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<ProjectResponse> response =
                projectService
                        .getCandidateProjects(candidate.getId())
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long projectId,
            Authentication authentication) {

        String email = authentication.getName();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        projectService.deleteProject(
                projectId,
                candidate.getId()
        );

        return ResponseEntity.noContent().build();
    }

    private ProjectResponse toResponse(Project project) {

        return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getTechnologies(),
                project.getProjectUrl(),
                project.getGithubUrl()
        );
    }
}