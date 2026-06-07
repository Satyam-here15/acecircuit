package com.acecircuit.backend.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.*;

@Service
public class ResumeService {

    @Autowired
    private GeminiService geminiService;

    public Map<String, Object> analyzeResume(MultipartFile file, String targetRole) throws Exception {
        // Extract text from PDF using PDFBox 3.x API
        byte[] bytes = file.getBytes();
        PDDocument document = Loader.loadPDF(bytes);
        PDFTextStripper stripper = new PDFTextStripper();
        String resumeText = stripper.getText(document);
        document.close();

        if (resumeText == null || resumeText.trim().isEmpty()) {
            throw new Exception("Could not extract text from PDF. Please ensure it's not a scanned image.");
        }

        if (resumeText.length() > 4000) {
            resumeText = resumeText.substring(0, 4000);
        }

        return geminiService.analyzeResume(resumeText, targetRole);
    }
}