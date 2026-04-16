package com.civic.policy.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.civic.auth.repository.UserRepository;
import com.civic.policy.entity.Policy;
import com.civic.policy.entity.Status;
import com.civic.policy.entity.Summary;
import com.civic.policy.repository.CompareHistoryRepository;
import com.civic.policy.repository.PolicyRepository;
import com.civic.policy.repository.SummaryRepository;

@RestController
@RequestMapping("/api/admin")
public class AdminPolicyController {
	@Autowired
	private PolicyRepository policyRepo;
	@Autowired
	private SummaryRepository summaryRepo;
	@Autowired
	private UserRepository userRepo;
	@Autowired
	private CompareHistoryRepository compareRepo;

	// ── Dashboard stats ───────────────────────────────────────────────────

	@GetMapping("/stats")
	public Map<String, Object> getStats() {
		Map<String, Object> stats = new HashMap<>();
		stats.put("totalPolicies", policyRepo.count());
		stats.put("totalUsers", userRepo.count());
		stats.put("totalSummaries", summaryRepo.count());
		stats.put("pendingReviews", summaryRepo.countByStatus(Status.PENDING));
		stats.put("totalCompares", compareRepo.count());
		return stats;
	}

	// ── Policy CRUD ───────────────────────────────────────────────────────

	@GetMapping("/policies")
	public List<Policy> getAllPolicies() {
		return policyRepo.findAll();
	}

	/**
	 * Create a new policy. The request body may include "contributionType":
	 * "EDUCATOR" | "CIVIC_ORGANIZATION" | "CIVIC_MANAGEMENT" | null. When null /
	 * absent the policy is visible to ALL contributor types.
	 */
	@PostMapping("/policies")
	public Policy addPolicy(@RequestBody Policy policy) {
		policy.setCreatedAt(LocalDateTime.now());
		policy.setUpdatedAt(LocalDateTime.now());
		// contributionType is already mapped by Jackson from the request body
		return policyRepo.save(policy);
	}

	/**
	 * Update an existing policy. Also persists the (possibly changed)
	 * contributionType.
	 */
	@PutMapping("/policies/{id}")
	public Policy updatePolicy(@PathVariable Long id, @RequestBody Policy updated) {
		Policy p = policyRepo.findById(id).orElseThrow();
		p.setTitle(updated.getTitle());
		p.setDescription(updated.getDescription());
		p.setCategory(updated.getCategory());
		p.setTags(updated.getTags());
		p.setContributionType(updated.getContributionType());
		p.setUpdatedAt(LocalDateTime.now());
		return policyRepo.save(p);
	}

	@DeleteMapping("/policies/{id}")
	public ResponseEntity<?> deletePolicy(@PathVariable Long id) {
		if (!policyRepo.existsById(id))
			return ResponseEntity.notFound().build();
		List<Summary> related = summaryRepo.findByPolicy_Id(id);
		summaryRepo.deleteAll(related);
		policyRepo.deleteById(id);
		return ResponseEntity.ok("Policy deleted successfully");
	}

	// ── Summary Review ─────────────────────────────────────────────────────

	@GetMapping("/summaries")
	public List<Summary> getAllSummaries() {
		return summaryRepo.findAll();
	}

	@PutMapping("/summaries/{id}/approve")
	public Summary approve(@PathVariable Long id) {
		Summary s = summaryRepo.findById(id).orElseThrow();
		s.setStatus(Status.APPROVED);
		return summaryRepo.save(s);
	}

	@PutMapping("/summaries/{id}/reject")
	public Summary reject(@PathVariable Long id) {
		Summary s = summaryRepo.findById(id).orElseThrow();
		s.setStatus(Status.REJECTED);
		return summaryRepo.save(s);
	}
}
