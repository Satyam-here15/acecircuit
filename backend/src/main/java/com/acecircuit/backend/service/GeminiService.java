package com.acecircuit.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.*;

@Service
public class GeminiService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private String callGroq(String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);

            Map<String, Object> body = new HashMap<>();
            body.put("model", model);
            body.put("messages", List.of(message));
            body.put("max_tokens", 1024);
            body.put("temperature", 0.7);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, request, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            return root.path("choices").get(0).path("message").path("content").asText();

        } catch (Exception e) {
            System.err.println("Error calling Groq API: " + e.getMessage());
            return "Unable to generate response at this time.";
        }
    }

    public String generateQuestion(String topic, String difficulty, int questionNumber) {
        String prompt = String.format(
            "You are a technical interviewer. Generate question #%d for a %s level %s interview. " +
            "Ask ONE clear, specific technical question only. No explanations, no answers, just the question. " +
            "Keep it concise and direct.",
            questionNumber, difficulty, topic
        );
        return callGroq(prompt);
    }

    public Map<String, Object> evaluateAnswer(String question, String answer, String topic) {
        String prompt = String.format(
            "You are a strict technical interviewer evaluating a %s interview answer.\n\n" +
            "Question: %s\n\nCandidate Answer: %s\n\n" +
            "Respond in this EXACT JSON format only, no extra text:\n" +
            "{\"score\": <number 1-10>, \"feedback\": \"<2-3 sentence evaluation>\", \"correct_answer\": \"<brief ideal answer>\"}",
            topic, question, answer
        );

        String raw = callGroq(prompt);
        try {
            // Extract JSON from response
            int start = raw.indexOf('{');
            int end = raw.lastIndexOf('}') + 1;
            if (start >= 0 && end > start) {
                String json = raw.substring(start, end);
                JsonNode node = objectMapper.readTree(json);
                Map<String, Object> result = new HashMap<>();
                result.put("score", node.path("score").asDouble(5.0));
                result.put("feedback", node.path("feedback").asText("Good attempt."));
                result.put("correct_answer", node.path("correct_answer").asText(""));
                return result;
            }
        } catch (Exception e) {
            System.err.println("Parse error: " + e.getMessage());
        }

        // Fallback
        Map<String, Object> fallback = new HashMap<>();
        fallback.put("score", 5.0);
        fallback.put("feedback", "Answer received and evaluated.");
        fallback.put("correct_answer", "");
        return fallback;
    }

    public String generateSessionFeedback(String topic, double avgScore, int totalQuestions) {
        String prompt = String.format(
            "A candidate just completed a %s interview with %d questions and an average score of %.1f/10. " +
            "Write a 2-3 sentence encouraging but honest overall performance summary with one specific improvement tip.",
            topic, totalQuestions, avgScore
        );
        return callGroq(prompt);
    }
}