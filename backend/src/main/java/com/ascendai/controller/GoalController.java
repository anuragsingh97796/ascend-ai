package com.ascendai.controller;

import com.ascendai.dto.ApiResponse;
import com.ascendai.entity.Goal;
import com.ascendai.repository.GoalRepository;
import com.ascendai.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    @Autowired
    private GoalRepository goalRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Goal>>> getUserGoals(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<Goal> goals = goalRepository.findByUserId(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Goals retrieved", goals));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Goal>> createGoal(@RequestBody Goal goal, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        goal.setUserId(userDetails.getId());
        goal.setCreatedAt(LocalDateTime.now());
        goal.setUpdatedAt(LocalDateTime.now());
        Goal saved = goalRepository.save(goal);
        return ResponseEntity.ok(ApiResponse.success("Goal created", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Goal>> updateGoal(@PathVariable String id, @RequestBody Goal goalUpdates, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return goalRepository.findById(id)
                .filter(g -> g.getUserId().equals(userDetails.getId()))
                .map(existing -> {
                    if (goalUpdates.getTitle() != null) existing.setTitle(goalUpdates.getTitle());
                    if (goalUpdates.getDescription() != null) existing.setDescription(goalUpdates.getDescription());
                    if (goalUpdates.getCategory() != null) existing.setCategory(goalUpdates.getCategory());
                    if (goalUpdates.getStatus() != null) existing.setStatus(goalUpdates.getStatus());
                    if (goalUpdates.getProgress() >= 0) existing.setProgress(goalUpdates.getProgress());
                    if (goalUpdates.getMilestones() != null) existing.setMilestones(goalUpdates.getMilestones());
                    existing.setUpdatedAt(LocalDateTime.now());
                    Goal saved = goalRepository.save(existing);
                    return ResponseEntity.ok(ApiResponse.success("Goal updated", saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteGoal(@PathVariable String id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return goalRepository.findById(id)
                .filter(g -> g.getUserId().equals(userDetails.getId()))
                .map(existing -> {
                    goalRepository.delete(existing);
                    return ResponseEntity.ok(ApiResponse.success("Goal deleted", id));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
