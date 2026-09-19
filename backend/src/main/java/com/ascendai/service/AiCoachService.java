package com.ascendai.service;

import com.ascendai.entity.Goal;
import com.ascendai.entity.Habit;
import com.ascendai.entity.JournalEntry;
import com.ascendai.repository.GoalRepository;
import com.ascendai.repository.HabitRepository;
import com.ascendai.repository.JournalEntryRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AiCoachService {

    private final ChatClient chatClient;
    private final GoalRepository goalRepository;
    private final HabitRepository habitRepository;
    private final JournalEntryRepository journalRepository;

    @Autowired
    public AiCoachService(ChatClient.Builder chatClientBuilder, 
                          GoalRepository goalRepository, 
                          HabitRepository habitRepository, 
                          JournalEntryRepository journalRepository) {
        this.chatClient = chatClientBuilder.build();
        this.goalRepository = goalRepository;
        this.habitRepository = habitRepository;
        this.journalRepository = journalRepository;
    }

    @org.springframework.beans.factory.annotation.Value("${spring.ai.openai.api-key:}")
    private String openAiApiKey;

    public String generateCoachResponse(String userId, String userMessage) {
        List<Goal> goals = goalRepository.findByUserId(userId);
        List<Habit> habits = habitRepository.findByUserId(userId);
        List<JournalEntry> journals = journalRepository.findByUserId(userId);

        String contextStr = buildContextString(goals, habits, journals);
        
        System.out.println("API KEY LENGTH: " + (openAiApiKey == null ? "null" : openAiApiKey.length()) + " VAL: " + openAiApiKey); 

        String systemPrompt = "You are Ascend AI, an expert productivity coach and mentor. " +
                "You have access to the user's current context (Goals, Habits, and Journals). " +
                "Provide a highly personalized, concise, and actionable response based on their context.\n\n" +
                "USER CONTEXT:\n" + contextStr;

        try {
            return chatClient.prompt()
                    .system(systemPrompt)
                    .user(userMessage)
                    .call()
                    .content();
        } catch (Exception e) {
            e.printStackTrace(); return "ERROR: " + e.getMessage();
        }
    }

    private String buildContextString(List<Goal> goals, List<Habit> habits, List<JournalEntry> journals) {
        StringBuilder sb = new StringBuilder();
        
        sb.append("--- GOALS ---\n");
        if (goals.isEmpty()) sb.append("No active goals.\n");
        for (Goal g : goals) {
            sb.append(g.getTitle()).append(" (Status: ").append(g.getStatus())
              .append(", Progress: ").append(g.getProgress()).append("%)\n");
        }
        
        sb.append("\n--- HABITS ---\n");
        if (habits.isEmpty()) sb.append("No active habits.\n");
        for (Habit h : habits) {
            sb.append(h.getName()).append(" (Streak: ").append(h.getCurrentStreak())
              .append(", Frequency: ").append(h.getFrequency()).append(")\n");
        }
        
        sb.append("\n--- RECENT JOURNALS (Last 3) ---\n");
        if (journals.isEmpty()) sb.append("No recent entries.\n");
        int count = 0;
        for (JournalEntry j : journals) {
            if (count >= 3) break;
            sb.append("Title: ").append(j.getTitle()).append(" | Mood: ").append(j.getMood()).append("\n");
            count++;
        }
        
        return sb.toString();
    }
}


