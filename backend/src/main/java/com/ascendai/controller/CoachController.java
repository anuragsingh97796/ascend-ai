package com.ascendai.controller;

import com.ascendai.dto.ApiResponse;
import com.ascendai.entity.CoachChat;
import com.ascendai.repository.CoachChatRepository;
import com.ascendai.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coach")
public class CoachController {

    @Autowired
    private CoachChatRepository coachChatRepository;

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<CoachChat>>> getChatHistory(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<CoachChat> history = coachChatRepository.findByUserIdOrderByTimestampAsc(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Chat history retrieved", history));
    }

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<CoachChat>> sendChatMessage(@RequestBody Map<String, String> payload, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String messageText = payload.get("message");

        if (messageText == null || messageText.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Message cannot be empty"));
        }

        // Save User Message
        CoachChat userMsg = new CoachChat(userDetails.getId(), "user", messageText);
        coachChatRepository.save(userMsg);

        // Generate AI Response
        String responseText = generateAiCoachResponse(messageText);
        CoachChat assistantMsg = new CoachChat(userDetails.getId(), "assistant", responseText);
        CoachChat savedAssistantMsg = coachChatRepository.save(assistantMsg);

        return ResponseEntity.ok(ApiResponse.success("Coach response generated", savedAssistantMsg));
    }

    private String generateAiCoachResponse(String prompt) {
        String p = prompt.toLowerCase();
        if (p.contains("goal") || p.contains("focus")) {
            return "Based on your current trajectory, breaking down your weekly target into 25-minute pomodoro blocks will maximize focus stability.";
        } else if (p.contains("habit") || p.contains("streak")) {
            return "Consistency is about momentum. Never miss two days in a row to maintain neural pathway reinforcement.";
        } else if (p.contains("reflect") || p.contains("journal")) {
            return "Writing down your reflections helps externalize cognitive load and process subconscious friction.";
        }
        return "I have analyzed your input. Let us align today's priorities with your long-term ascension targets.";
    }
}
