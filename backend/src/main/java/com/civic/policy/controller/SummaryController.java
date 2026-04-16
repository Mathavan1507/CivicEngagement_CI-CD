package com.civic.policy.controller;

import com.civic.auth.entity.Users;
import com.civic.auth.repository.UserRepository;
import com.civic.policy.entity.Policy;
import com.civic.policy.entity.Status;
import com.civic.policy.entity.Summary;
import com.civic.policy.repository.PolicyRepository;
import com.civic.policy.repository.SummaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/summaries")
public class SummaryController {

	@Autowired
	private SummaryRepository summaryRepo;
	@Autowired
	private PolicyRepository policyRepo;
	@Autowired
	private UserRepository userRepo;

	@PostMapping
	public ResponseEntity<?> submit(@RequestBody Map<String, Object> body, Authentication auth) {
		// Get logged-in user from Spring Security
		String email = auth.getName();
		Optional<Users> userOpt = userRepo.findByEmail(email);
		if (userOpt.isEmpty())
			return ResponseEntity.status(403).body("User session not found");

		Long policyId;
		String content;
		try {
			policyId = Long.valueOf(body.get("policyId").toString());
			content = body.get("content").toString().trim();
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Invalid request body");
		}

		if (content.isBlank())
			return ResponseEntity.badRequest().body("Summary content cannot be empty");

		Optional<Policy> policyOpt = policyRepo.findById(policyId);
		if (policyOpt.isEmpty())
			return ResponseEntity.badRequest().body("Policy not found");

		Summary s = new Summary();
		s.setContent(content);
		s.setPolicy(policyOpt.get());
		s.setUser(userOpt.get());
		s.setStatus(Status.PENDING);

		return ResponseEntity.ok(summaryRepo.save(s));
	}

	/** Get all approved summaries for a specific policy */
	@GetMapping("/{policyId}")
	public List<Summary> getApproved(@PathVariable Long policyId) {
		return summaryRepo.findByPolicy_IdAndStatus(policyId, Status.APPROVED);
	}
}
