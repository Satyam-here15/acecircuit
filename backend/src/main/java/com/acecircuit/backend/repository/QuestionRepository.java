package com.acecircuit.backend.repository;

import com.acecircuit.backend.model.Question;
import com.acecircuit.backend.model.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findBySessionOrderByQuestionNumber(InterviewSession session);
    int countBySession(InterviewSession session);
}