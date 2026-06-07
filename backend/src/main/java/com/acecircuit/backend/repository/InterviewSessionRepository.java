package com.acecircuit.backend.repository;

import com.acecircuit.backend.model.InterviewSession;
import com.acecircuit.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {
    List<InterviewSession> findByUserOrderByCreatedAtDesc(User user);
    List<InterviewSession> findByUserAndStatus(User user, String status);
}