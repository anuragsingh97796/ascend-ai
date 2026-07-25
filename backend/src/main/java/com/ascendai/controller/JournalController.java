package com.ascendai.controller;

import com.ascendai.dto.ApiResponse;
import com.ascendai.entity.JournalEntry;
import com.ascendai.repository.JournalEntryRepository;
import com.ascendai.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/journal")
public class JournalController {

    @Autowired
    private JournalEntryRepository journalEntryRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<JournalEntry>>> getUserEntries(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<JournalEntry> entries = journalEntryRepository.findByUserId(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Journal entries retrieved", entries));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<JournalEntry>> createEntry(@RequestBody JournalEntry entry, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        entry.setUserId(userDetails.getId());
        entry.setCreatedAt(LocalDateTime.now());
        entry.setUpdatedAt(LocalDateTime.now());
        if (entry.getContent() != null) {
            entry.setWordCount(entry.getContent().split("\\s+").length);
        }
        JournalEntry saved = journalEntryRepository.save(entry);
        return ResponseEntity.ok(ApiResponse.success("Journal entry created", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<JournalEntry>> updateEntry(@PathVariable String id, @RequestBody JournalEntry entryUpdates, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return journalEntryRepository.findById(id)
                .filter(e -> e.getUserId().equals(userDetails.getId()))
                .map(existing -> {
                    if (entryUpdates.getTitle() != null) existing.setTitle(entryUpdates.getTitle());
                    if (entryUpdates.getContent() != null) {
                        existing.setContent(entryUpdates.getContent());
                        existing.setWordCount(entryUpdates.getContent().split("\\s+").length);
                    }
                    if (entryUpdates.getMood() != null) existing.setMood(entryUpdates.getMood());
                    if (entryUpdates.getTags() != null) existing.setTags(entryUpdates.getTags());
                    existing.setUpdatedAt(LocalDateTime.now());
                    JournalEntry saved = journalEntryRepository.save(existing);
                    return ResponseEntity.ok(ApiResponse.success("Journal entry updated", saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteEntry(@PathVariable String id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return journalEntryRepository.findById(id)
                .filter(e -> e.getUserId().equals(userDetails.getId()))
                .map(existing -> {
                    journalEntryRepository.delete(existing);
                    return ResponseEntity.ok(ApiResponse.success("Journal entry deleted", id));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
