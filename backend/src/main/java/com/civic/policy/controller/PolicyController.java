package com.civic.policy.controller;
 
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.civic.auth.entity.Users;
import com.civic.auth.repository.UserRepository;
import com.civic.policy.entity.Policy;
import com.civic.policy.repository.PolicyRepository;
 
@RestController
@RequestMapping("/api/policies")
public class PolicyController {
 
    @Autowired private PolicyRepository repo;
    @Autowired private UserRepository   userRepo;
    
    
    @GetMapping
    public List<Policy> getAll(Authentication auth) {
        String email = auth.getName();
        Users user = userRepo.findByEmail(email).orElseThrow();
 
        if (user.getRole().name().equals("CONTRIBUTOR") && user.getContributorType() != null) {
            return repo.findByContributionTypeOrContributionTypeIsNull(user.getContributorType());
        }
        return repo.findAll();
    }
 
    @GetMapping("/{id}")
    public Policy getById(@PathVariable Long id) {
        Policy p = repo.findById(id).orElseThrow();
        p.setViews(p.getViews() + 1);
        return repo.save(p);
    }
 
    @GetMapping("/search")
    public List<Policy> search(@RequestParam String keyword) {
        return repo.findByTitleContainingIgnoreCaseOrDescriptionContaining(keyword, keyword);
    }
 
    @GetMapping("/trending")
    public List<Policy> trending() {
        return repo.findTop5ByOrderByViewsDesc();
    }
 
    @GetMapping("/new")
    public List<Policy> newest() {
        return repo.findTop5ByOrderByCreatedAtDesc();
    }
 
    @GetMapping("/filter")
    public List<Policy> byCategory(@RequestParam String category) {
        return repo.findByCategory(category);
    }
}