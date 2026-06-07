package com.acecircuit.backend.service;

import com.acecircuit.backend.dto.*;
import com.acecircuit.backend.model.*;
import com.acecircuit.backend.repository.*;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class InterviewService {

    private final InterviewSessionRepository sessionRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final GeminiService geminiService;

    private static final int MAX_QUESTIONS = 5;

    public InterviewService(InterviewSessionRepository sessionRepository,
                            QuestionRepository questionRepository,
                            UserRepository userRepository,
                            GeminiService geminiService) {
        this.sessionRepository = sessionRepository;
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
        this.geminiService = geminiService;
    }

    public Map<String, Object> startSession(User user, StartSessionRequest request) {
        InterviewSession session = new InterviewSession();
        session.setUser(user);
        session.setTopic(request.getTopic());
        session.setDifficulty(request.getDifficulty());
        session.setStatus("IN_PROGRESS");
        session.setTotalQuestions(0);
        session.setTotalScore(0.0);
        sessionRepository.save(session);

        String firstQuestion = geminiService.generateQuestion(request.getTopic(), request.getDifficulty(), 1);

        Map<String, Object> response = new HashMap<>();
        response.put("sessionId", session.getId());
        response.put("question", firstQuestion);
        response.put("questionNumber", 1);
        response.put("totalQuestions", MAX_QUESTIONS);
        response.put("topic", request.getTopic());
        response.put("difficulty", request.getDifficulty());
        return response;
    }

    public Map<String, Object> submitAnswer(User user, SubmitAnswerRequest request) {
        InterviewSession session = sessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session not found"));

        Map<String, Object> evaluation = geminiService.evaluateAnswer(
                request.getQuestion(), request.getAnswer(), session.getTopic());

        Question question = new Question();
        question.setSession(session);
        question.setQuestionText(request.getQuestion());
        question.setUserAnswer(request.getAnswer());
        question.setAiFeedback((String) evaluation.get("feedback"));
        question.setScore(((Number) evaluation.get("score")).doubleValue());
        question.setQuestionNumber(request.getQuestionNumber());
        questionRepository.save(question);

        session.setTotalScore(session.getTotalScore() + question.getScore());
        session.setTotalQuestions(session.getTotalQuestions() + 1);
        sessionRepository.save(session);

        Map<String, Object> response = new HashMap<>();
        response.put("score", question.getScore());
        response.put("feedback", evaluation.get("feedback"));
        response.put("correctAnswer", evaluation.get("correct_answer"));

        if (request.getQuestionNumber() >= MAX_QUESTIONS) {
            return completeSession(session, user, response);
        }

        String nextQuestion = geminiService.generateQuestion(
                session.getTopic(), session.getDifficulty(), request.getQuestionNumber() + 1);

        response.put("nextQuestion", nextQuestion);
        response.put("nextQuestionNumber", request.getQuestionNumber() + 1);
        response.put("isComplete", false);
        return response;
    }

    private Map<String, Object> completeSession(InterviewSession session, User user, Map<String, Object> response) {
        double avgScore = session.getTotalScore() / session.getTotalQuestions();
        int points = (int) (avgScore * 10);

        String overallFeedback = geminiService.generateSessionFeedback(
                session.getTopic(), avgScore, session.getTotalQuestions());

        session.setStatus("COMPLETED");
        session.setFeedback(overallFeedback);
        session.setPointsEarned(points);
        session.setCompletedAt(LocalDateTime.now());
        sessionRepository.save(session);

        user.setTotalSessions(user.getTotalSessions() + 1);
        user.setTotalPoints(user.getTotalPoints() + points);
        double newAvg = ((user.getAverageScore() * (user.getTotalSessions() - 1)) + avgScore) / user.getTotalSessions();
        user.setAverageScore(Math.round(newAvg * 10.0) / 10.0);
        userRepository.save(user);

        response.put("isComplete", true);
        response.put("averageScore", avgScore);
        response.put("overallFeedback", overallFeedback);
        response.put("pointsEarned", points);
        return response;
    }

    public List<InterviewSession> getUserSessions(User user) {
        return sessionRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Map<String, Object> getSessionDetails(Long sessionId) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        List<Question> questions = questionRepository.findBySessionOrderByQuestionNumber(session);

        Map<String, Object> response = new HashMap<>();
        response.put("session", session);
        response.put("questions", questions);
        return response;
    }

    public List<User> getLeaderboard() {
        return userRepository.findAll().stream()
                .filter(u -> u.getTotalSessions() > 0)
                .sorted((a, b) -> b.getTotalPoints() - a.getTotalPoints())
                .limit(10)
                .toList();
    }
}