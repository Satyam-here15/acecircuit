package com.acecircuit.backend.controller;

import com.acecircuit.backend.dto.*;
import com.acecircuit.backend.model.*;
import com.acecircuit.backend.repository.UserRepository;
import com.acecircuit.backend.service.InterviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/interview")
@CrossOrigin(origins = "*")
public class InterviewController {

    private final InterviewService interviewService;
    private final UserRepository userRepository;

    public InterviewController(InterviewService interviewService, UserRepository userRepository) {
        this.interviewService = interviewService;
        this.userRepository = userRepository;
    }

    private User getCurrentUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/start")
    public ResponseEntity<Map<String, Object>> startSession(
            @RequestBody StartSessionRequest request, Authentication auth) {
        return ResponseEntity.ok(interviewService.startSession(getCurrentUser(auth), request));
    }

    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitAnswer(
            @RequestBody SubmitAnswerRequest request, Authentication auth) {
        return ResponseEntity.ok(interviewService.submitAnswer(getCurrentUser(auth), request));
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<InterviewSession>> getSessions(Authentication auth) {
        return ResponseEntity.ok(interviewService.getUserSessions(getCurrentUser(auth)));
    }

    @GetMapping("/sessions/{id}")
    public ResponseEntity<Map<String, Object>> getSessionDetails(@PathVariable Long id) {
        return ResponseEntity.ok(interviewService.getSessionDetails(id));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<User>> getLeaderboard() {
        return ResponseEntity.ok(interviewService.getLeaderboard());
    }
}