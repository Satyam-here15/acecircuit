package com.acecircuit.backend.dto;

import lombok.Data;

@Data
public class InterviewRequest {
    private String topic;
    private String difficulty;
    private Integer totalQuestions;
}