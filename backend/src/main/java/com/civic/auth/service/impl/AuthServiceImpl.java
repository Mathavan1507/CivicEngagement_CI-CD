package com.civic.auth.service.impl;

import com.civic.auth.dto.AuthResponse;
import com.civic.auth.dto.RegisterRequest;
import com.civic.auth.entity.*;
import com.civic.auth.repository.UserRepository;
import com.civic.auth.service.AuthService;
import com.civic.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

	@Autowired
	private JwtUtil jwtUtil;
	@Autowired
	private UserRepository repo;
	@Autowired
	private PasswordEncoder encoder;

	@Override
	public String register(RegisterRequest req) {
		if (repo.existsByEmail(req.getEmail()))
			throw new RuntimeException("Email already registered");

		Users user = new Users();
		user.setName(req.getName().trim());
		user.setEmail(req.getEmail().trim().toLowerCase());
		user.setPassword(encoder.encode(req.getPassword()));
		user.setActive(true);

		if ("CONTRIBUTOR".equalsIgnoreCase(req.getRole())) {
			user.setRole(Role.CONTRIBUTOR);
			if (req.getContributorType() != null && !req.getContributorType().isBlank()) {
				try {
					user.setContributorType(ContributorType.valueOf(req.getContributorType().toUpperCase()));
				} catch (IllegalArgumentException e) {
					throw new RuntimeException("Invalid contributor type: " + req.getContributorType());
				}
			}
		} else {
			user.setRole(Role.USER);
		}

		repo.save(user);
		return "Registered successfully";
	}

	@Override
	public AuthResponse login(String email, String password) {
		Users user = repo.findByEmail(email.trim().toLowerCase())
				.orElseThrow(() -> new RuntimeException("User not found"));

		if (!user.isActive())
			throw new RuntimeException("Account is deactivated. Contact admin.");

		if (!encoder.matches(password, user.getPassword()))
			throw new RuntimeException("Invalid credentials");

		String token = jwtUtil.generateToken(user);
		String ct = user.getContributorType() != null ? user.getContributorType().name() : null;
		return new AuthResponse(token, user.getRole().name(), ct, user.getName(), user.getId());
	}

	public Users register(Users user) {
		
		return null;
	}
}
