package com.civic.policy.entity;

import com.civic.auth.entity.Users;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * TABLE 3: summary Stores contributor submissions with proper FK to users and
 * policy tables
 */
@Entity
@Table(name = "summary")
public class Summary {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(length = 4000, nullable = false)
	private String content;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Status status = Status.PENDING;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "policy_id", nullable = false)
	@JsonIgnoreProperties({ "description", "hibernateLazyInitializer" })
	private Policy policy;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "user_id", nullable = false)
	@JsonIgnoreProperties({ "password", "hibernateLazyInitializer" })
	private Users user;

	@Column(name = "submitted_at")
	private LocalDateTime submittedAt = LocalDateTime.now();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String c) {
		this.content = c;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status s) {
		this.status = s;
	}

	public Policy getPolicy() {
		return policy;
	}

	public void setPolicy(Policy p) {
		this.policy = p;
	}

	public Users getUser() {
		return user;
	}

	public void setUser(Users u) {
		this.user = u;
	}

	public LocalDateTime getSubmittedAt() {
		return submittedAt;
	}

	public void setSubmittedAt(LocalDateTime d) {
		this.submittedAt = d;
	}
}
