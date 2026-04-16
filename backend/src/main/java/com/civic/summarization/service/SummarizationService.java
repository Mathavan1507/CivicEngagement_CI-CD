package com.civic.summarization.service;
 
import com.civic.summarization.dto.SummaryResult;
import org.springframework.stereotype.Service;
 
import java.util.*;
import java.util.stream.*;
 
@Service
public class SummarizationService {
 
    private static final Set<String> STOP_WORDS = Set.of(
        "a","an","the","and","or","but","in","on","at","to","for","of","with","by","from","as",
        "is","was","are","were","be","been","have","has","had","do","does","did","will","would",
        "could","should","may","might","this","that","these","those","it","its","not","so","also"
    );
 
    private record Scored(int index, String sentence, double score) {}
 
    public SummaryResult summarize(String text) {
        if (text == null || text.isBlank())
            return new SummaryResult("No text provided.", 0, 0);
 
        List<String> sentences = extractSentences(text);
        int total = sentences.size();
 
        if (total == 0)
            return new SummaryResult(text.trim(), 1, 1);
 
        int target = Math.max(3, Math.min(10, (int) Math.round(total * 0.30)));
 
        if (total <= target) {
            String joined = sentences.stream()
                    .map(this::ensurePeriod).collect(Collectors.joining(" "));
            return new SummaryResult(joined, total, total);
        }
 
        Map<String, Integer> freq = buildFreq(text);
 
        List<Scored> scored = new ArrayList<>();
        for (int i = 0; i < sentences.size(); i++) {
            double score = scoreSentence(sentences.get(i), freq);
            double bonus = (i == 0 || i == sentences.size() - 1) ? 0.3 : 0;
            scored.add(new Scored(i, sentences.get(i), score * (1 + bonus)));
        }
 
        String summary = scored.stream()
                .sorted(Comparator.comparingDouble(Scored::score).reversed())
                .limit(target)
                .sorted(Comparator.comparingInt(Scored::index))
                .map(s -> ensurePeriod(s.sentence()))
                .collect(Collectors.joining(" "));
 
        return new SummaryResult(summary, total, target);
    }
 
    private List<String> extractSentences(String text) {
        return Arrays.stream(text.split("(?<=[.!?])\\s+(?=[A-Z])|(?<=[.!?])\\n|\\n{2,}"))
                .map(String::trim)
                .filter(s -> !s.isBlank() && s.split("\\s+").length >= 4)
                .collect(Collectors.toList());
    }
 
    private Map<String, Integer> buildFreq(String text) {
        Map<String, Integer> freq = new HashMap<>();
        for (String w : text.toLowerCase().split("[^a-zA-Z]+")) {
            if (w.length() > 2 && !STOP_WORDS.contains(w))
                freq.merge(w, 1, Integer::sum);
        }
        return freq;
    }
 
    private double scoreSentence(String s, Map<String, Integer> freq) {
        String[] tokens = s.toLowerCase().split("[^a-zA-Z]+");
        double score = 0;
        int count = 0;
        for (String t : tokens) {
            if (t.length() > 2 && !STOP_WORDS.contains(t)) {
                score += freq.getOrDefault(t, 0);
                count++;
            }
        }
        return count > 0 ? score / count : 0;
    }
 
    private String ensurePeriod(String s) {
        s = s.trim();
        return (s.endsWith(".") || s.endsWith("!") || s.endsWith("?")) ? s : s + ".";
    }
}