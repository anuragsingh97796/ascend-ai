package com.ascendai.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "coach_chats")
public class CoachChat {
    @Id
    private String id;
    private String userId;
    private String sender; // "user" or "assistant"
    private String text;
    private LocalDateTime timestamp;

    public CoachChat() {}

    public CoachChat(String userId, String sender, String text) {
        this.userId = userId;
        this.sender = sender;
        this.text = text;
        this.timestamp = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
