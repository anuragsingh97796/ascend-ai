package com.ascendai.controller;

import com.ascendai.dto.ApiResponse;
import com.ascendai.entity.CoachChat;
import com.ascendai.repository.CoachChatRepository;
import com.ascendai.security.UserDetailsImpl;
import com.ascendai.service.AiCoachService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coach")
public class CoachController {

    private final CoachChatRepository coachChatRepository;
    private final AiCoachService aiCoachService;

    @Autowired
    public CoachController(CoachChatRepository coachChatRepository, AiCoachService aiCoachService) {
        this.coachChatRepository = coachChatRepository;
        this.aiCoachService = aiCoachService;
    }

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

        // Generate AI Response using real AI Service
        String responseText = aiCoachService.generateCoachResponse(userDetails.getId(), messageText);
        
        // Save Assistant Message
        CoachChat assistantMsg = new CoachChat(userDetails.getId(), "assistant", responseText);
        CoachChat savedAssistantMsg = coachChatRepository.save(assistantMsg);

        return ResponseEntity.ok(ApiResponse.success("Coach response generated", savedAssistantMsg));
    }
}
