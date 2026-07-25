package com.ascendai.repository;

import com.ascendai.entity.JournalEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface JournalEntryRepository extends MongoRepository<JournalEntry, String> {
    List<JournalEntry> findByUserId(String userId);
}
