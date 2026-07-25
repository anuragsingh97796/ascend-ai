package com.ascendai.repository;

import com.ascendai.entity.Goal;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface GoalRepository extends MongoRepository<Goal, String> {
    List<Goal> findByUserId(String userId);
}
