package com.civic.auth.controller;

import com.civic.auth.dto.UserDto;
import com.civic.auth.entity.Role;
import com.civic.auth.entity.Users;
import com.civic.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminUserController {

	@Autowired
	private UserRepository repo;

	@GetMapping("/all-users")
	public List<UserDto> getAllUsers() {
		return repo.findAll().stream().map(this::toDto).collect(Collectors.toList());
	}


	@GetMapping("/users")
	public List<UserDto> getUsers() {
		return repo.findByRole(Role.USER).stream().map(this::toDto).collect(Collectors.toList());
	}

	@PutMapping("/users/{id}")
	public ResponseEntity<?> toggleUser(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
		Users u = repo.findById(id).orElseThrow();
		if (u.getRole() == Role.ADMIN)
			return ResponseEntity.badRequest().body("Cannot deactivate admin account");
		u.setActive(body.get("active"));
		return ResponseEntity.ok(toDto(repo.save(u)));
	}


	@GetMapping("/contributors")
	public List<UserDto> getContributors() {
		return repo.findByRole(Role.CONTRIBUTOR).stream().map(this::toDto).collect(Collectors.toList());
	}

	@PutMapping("/contributors/{id}")
	public ResponseEntity<?> toggleContributor(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
		Users u = repo.findById(id).orElseThrow();
		u.setActive(body.get("active"));
		return ResponseEntity.ok(toDto(repo.save(u)));
	}


	private UserDto toDto(Users u) {
		UserDto dto = new UserDto();
		dto.setId(u.getId());
		dto.setName(u.getName());
		dto.setEmail(u.getEmail());
		dto.setRole(u.getRole().name());
		dto.setContributorType(u.getContributorType() != null ? u.getContributorType().name() : null);
		dto.setActive(u.isActive());
		dto.setCreatedAt(u.getCreatedAt() != null ? u.getCreatedAt().toString() : "");
		return dto;
	}
}
