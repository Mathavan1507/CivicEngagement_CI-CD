package com.civic.policy.entity;

import com.civic.auth.entity.Users;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * TABLE 4: compare_history Records every policy comparison made by users —
 * stores both policy FKs and the insight text
 */
@Entity
@Table(name = "compare_history")
public class CompareHistory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "policy1_id", nullable = false)
	@JsonIgnoreProperties({ "description", "hibernateLazyInitializer" })
	private Policy policy1;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "policy2_id", nullable = false)
	@JsonIgnoreProperties({ "description", "hibernateLazyInitializer" })
	private Policy policy2;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "user_id", nullable = false)
	@JsonIgnoreProperties({ "password", "hibernateLazyInitializer" })
	private Users user;

	@Column(length = 2000)
	private String insight;

	@Column(name = "compared_at")
	private LocalDateTime comparedAt = LocalDateTime.now();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Policy getPolicy1() {
		return policy1;
	}

	public void setPolicy1(Policy p) {
		this.policy1 = p;
	}

	public Policy getPolicy2() {
		return policy2;
	}

	public void setPolicy2(Policy p) {
		this.policy2 = p;
	}

	public Users getUser() {
		return user;
	}

	public void setUser(Users u) {
		this.user = u;
	}

	public String getInsight() {
		return insight;
	}

	public void setInsight(String i) {
		this.insight = i;
	}

	public LocalDateTime getComparedAt() {
		return comparedAt;
	}

	public void setComparedAt(LocalDateTime d) {
		this.comparedAt = d;
	}
}
