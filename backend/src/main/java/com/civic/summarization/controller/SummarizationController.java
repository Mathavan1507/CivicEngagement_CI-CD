package com.civic.summarization.controller;
 
import com.civic.summarization.dto.SummaryResult;
import com.civic.summarization.service.SummarizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
 
@RestController
@RequestMapping("/api/summarize")
public class SummarizationController {
 
    @Autowired private SummarizationService service;
 
    @PostMapping
    public ResponseEntity<SummaryResult> summarize(@RequestBody Map<String, String> body) {
        String text = body.get("text");
        if (text == null || text.isBlank())
            return ResponseEntity.badRequest().body(new SummaryResult("No text provided.", 0, 0));
        return ResponseEntity.ok(service.summarize(text));
    }
}