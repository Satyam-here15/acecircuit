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
    public Map<String, Object> analyzeResume(String resumeText, String targetRole) {
    String prompt = String.format(
        "You are an expert tech recruiter and career coach. Analyze this resume for a %s position.\n\n" +
        "RESUME:\n%s\n\n" +
        "Respond in this EXACT JSON format only, no extra text:\n" +
        "{\n" +
        "  \"overall_score\": <number 1-100>,\n" +
        "  \"summary\": \"<2 sentence overall assessment>\",\n" +
        "  \"strengths\": [\"<strength 1>\", \"<strength 2>\", \"<strength 3>\"],\n" +
        "  \"weaknesses\": [\"<weakness 1>\", \"<weakness 2>\", \"<weakness 3>\"],\n" +
        "  \"missing_skills\": [\"<skill 1>\", \"<skill 2>\", \"<skill 3>\", \"<skill 4>\"],\n" +
        "  \"improvements\": [\"<tip 1>\", \"<tip 2>\", \"<tip 3>\"],\n" +
        "  \"ats_score\": <number 1-100>,\n" +
        "  \"hire_recommendation\": \"<Strong Yes / Yes / Maybe / No>\"\n" +
        "}",
        targetRole, resumeText
    );

    String raw = callGroq(prompt);
    try {
        int start = raw.indexOf('{');
        int end = raw.lastIndexOf('}') + 1;
        if (start >= 0 && end > start) {
            String json = raw.substring(start, end);
            JsonNode node = objectMapper.readTree(json);
            Map<String, Object> result = new HashMap<>();
            result.put("overall_score", node.path("overall_score").asInt(50));
            result.put("summary", node.path("summary").asText(""));
            result.put("strengths", node.path("strengths"));
            result.put("weaknesses", node.path("weaknesses"));
            result.put("missing_skills", node.path("missing_skills"));
            result.put("improvements", node.path("improvements"));
            result.put("ats_score", node.path("ats_score").asInt(50));
            result.put("hire_recommendation", node.path("hire_recommendation").asText("Maybe"));
            return result;
        }
    } catch (Exception e) {
        System.err.println("Resume parse error: " + e.getMessage());
    }

    Map<String, Object> fallback = new HashMap<>();
    fallback.put("overall_score", 50);
    fallback.put("summary", "Analysis complete.");
    fallback.put("ats_score", 50);
    fallback.put("hire_recommendation", "Maybe");
    return fallback;
}
}