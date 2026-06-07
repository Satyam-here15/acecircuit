package com.acecircuit.backend.dto;

public class AuthResponse {
    private String token;
    private String username;
    private String email;
    private String fullName;
    private Integer totalSessions;
    private Double averageScore;
    private Integer totalPoints;

    public AuthResponse(String token, String username, String email, String fullName,
                        Integer totalSessions, Double averageScore, Integer totalPoints) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.totalSessions = totalSessions;
        this.averageScore = averageScore;
        this.totalPoints = totalPoints;
    }

    public String getToken() { return token; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
    public Integer getTotalSessions() { return totalSessions; }
    public Double getAverageScore() { return averageScore; }
    public Integer getTotalPoints() { return totalPoints; }
}