package com.ascendai.controller;

import com.ascendai.dto.ApiResponse;
import com.ascendai.entity.Habit;
import com.ascendai.repository.HabitRepository;
import com.ascendai.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/habits")
public class HabitController {

    @Autowired
    private HabitRepository habitRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Habit>>> getUserHabits(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<Habit> habits = habitRepository.findByUserId(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Habits retrieved", habits));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Habit>> createHabit(@RequestBody Habit habit, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        habit.setUserId(userDetails.getId());
        habit.setCreatedAt(LocalDateTime.now());
        Habit saved = habitRepository.save(habit);
        return ResponseEntity.ok(ApiResponse.success("Habit created", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Habit>> updateHabit(@PathVariable String id, @RequestBody Habit habitUpdates, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return habitRepository.findById(id)
                .filter(h -> h.getUserId().equals(userDetails.getId()))
                .map(existing -> {
                    if (habitUpdates.getName() != null) existing.setName(habitUpdates.getName());
                    if (habitUpdates.getDescription() != null) existing.setDescription(habitUpdates.getDescription());
                    if (habitUpdates.getCompletedDates() != null) existing.setCompletedDates(habitUpdates.getCompletedDates());
                    existing.setCurrentStreak(habitUpdates.getCurrentStreak());
                    existing.setLongestStreak(habitUpdates.getLongestStreak());
                    Habit saved = habitRepository.save(existing);
                    return ResponseEntity.ok(ApiResponse.success("Habit updated", saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteHabit(@PathVariable String id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return habitRepository.findById(id)
                .filter(h -> h.getUserId().equals(userDetails.getId()))
                .map(existing -> {
                    habitRepository.delete(existing);
                    return ResponseEntity.ok(ApiResponse.success("Habit deleted", id));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
