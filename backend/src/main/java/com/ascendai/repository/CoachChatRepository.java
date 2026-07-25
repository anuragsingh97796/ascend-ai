package com.ascendai.repository;

import com.ascendai.entity.CoachChat;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CoachChatRepository extends MongoRepository<CoachChat, String> {
    List<CoachChat> findByUserIdOrderByTimestampAsc(String userId);
}
