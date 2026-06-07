package com.acecircuit.backend.controller;

import com.acecircuit.backend.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "*")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeResume(
        @RequestParam("file") MultipartFile file,
        @RequestParam("targetRole") String targetRole
    ) {
        try {
            if (file.isEmpty()) return ResponseEntity.badRequest().body("No file uploaded");
            if (!file.getOriginalFilename().endsWith(".pdf"))
                return ResponseEntity.badRequest().body("Only PDF files are supported");

            Map<String, Object> result = resumeService.analyzeResume(file, targetRole);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}