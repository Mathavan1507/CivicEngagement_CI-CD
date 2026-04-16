package com.civic.policy.controller;
 
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.civic.auth.repository.UserRepository;
import com.civic.compare.dto.CompareRequest;
import com.civic.compare.dto.CompareResponse;
import com.civic.compare.dto.DiffBlock;
import com.civic.compare.dto.PolicyDto;
import com.civic.policy.entity.CompareHistory;
import com.civic.policy.entity.Policy;
import com.civic.policy.repository.CompareHistoryRepository;
import com.civic.policy.repository.PolicyRepository;
 
@RestController
@RequestMapping("/api/compare")
public class CompareController {
 
    @Autowired private PolicyRepository policyRepo;
    @Autowired private CompareHistoryRepository compareRepo;
    @Autowired private UserRepository userRepo;
 
    @PostMapping
    public ResponseEntity<?> compare(@RequestBody CompareRequest req, Authentication auth) {
 
        if (req.getP1().equals(req.getP2()))
            return ResponseEntity.badRequest().body("Please select two different policies");
 
        Optional<Policy> opt1 = policyRepo.findById(req.getP1());
        Optional<Policy> opt2 = policyRepo.findById(req.getP2());
 
        if (opt1.isEmpty() || opt2.isEmpty())
            return ResponseEntity.badRequest().body("One or both policies not found");
 
        Policy p1Entity = opt1.get();
        Policy p2Entity = opt2.get();
 
        PolicyDto p1 = mapToDto(p1Entity);
        PolicyDto p2 = mapToDto(p2Entity);
 
        List<DiffBlock> blocks = computeDiff(p1.getDescription(), p2.getDescription());
        String insight = buildInsight(p1, p2, blocks);
 
        // Save to compare_history table
        String email = auth.getName();
        userRepo.findByEmail(email).ifPresent(user -> {
            CompareHistory history = new CompareHistory();
            history.setPolicy1(p1Entity);
            history.setPolicy2(p2Entity);
            history.setUser(user);
            history.setInsight(insight);
            compareRepo.save(history);
        });
 
        CompareResponse res = new CompareResponse();
        res.setPolicy1(p1);
        res.setPolicy2(p2);
        res.setBlocks(blocks);
        res.setInsight(insight);
        return ResponseEntity.ok(res);
    }
 
    private PolicyDto mapToDto(Policy p) {
        PolicyDto dto = new PolicyDto();
        dto.setId(p.getId());
        dto.setTitle(p.getTitle());
        dto.setDescription(p.getDescription());
        dto.setCategory(p.getCategory());
        dto.setTags(p.getTags());
        return dto;
    }
 
    private List<DiffBlock> computeDiff(String descA, String descB) {
        List<String> sentA = splitSentences(descA);
        List<String> sentB = splitSentences(descB);
        Set<String> wordsA = tokenize(descA);
        Set<String> wordsB = tokenize(descB);
 
        List<DiffBlock> blocks = new ArrayList<>();
 
        for (String s : sentA) {
            double sim = jaccard(tokenize(s), wordsB);
            blocks.add(new DiffBlock(sim >= 0.15 ? "COMMON" : "A_ONLY", s));
        }
 
        for (String s : sentB) {
            if (jaccard(tokenize(s), wordsA) < 0.15)
                blocks.add(new DiffBlock("B_ONLY", s));
        }
 
        return blocks;
    }
 
    private List<String> splitSentences(String text) {
        if (text == null) return List.of();
        return Arrays.stream(text.split("(?<=[.!?])\\s+|\\n+"))
                .map(String::trim)
                .filter(s -> !s.isBlank() && s.split("\\s+").length >= 3)
                .collect(Collectors.toList());
    }
 
    private Set<String> tokenize(String text) {
        if (text == null) return Set.of();
        return Arrays.stream(text.toLowerCase().split("[^a-zA-Z]+"))
                .filter(w -> w.length() > 3)
                .collect(Collectors.toSet());
    }
 
    private double jaccard(Set<String> a, Set<String> b) {
        if (a.isEmpty() || b.isEmpty()) return 0;
        long inter = a.stream().filter(b::contains).count();
        long union = a.size() + b.size() - inter;
        return union == 0 ? 0 : (double) inter / union;
    }
 
    private String buildInsight(PolicyDto p1, PolicyDto p2, List<DiffBlock> blocks) {
        long aOnly  = blocks.stream().filter(b -> "A_ONLY".equals(b.getType())).count();
        long bOnly  = blocks.stream().filter(b -> "B_ONLY".equals(b.getType())).count();
        long common = blocks.stream().filter(b -> "COMMON".equals(b.getType())).count();
 
        String catMsg = Objects.equals(p1.getCategory(), p2.getCategory())
                ? "Both policies belong to the same category: " + p1.getCategory() + ". "
                : "Policy A is under " + p1.getCategory()
                  + "; Policy B is under " + p2.getCategory() + ". ";
 
        return catMsg
                + "They share " + common + " common theme(s). "
                + "Policy A has " + aOnly + " unique provision(s). "
                + "Policy B introduces " + bOnly + " new element(s).";
    }
}