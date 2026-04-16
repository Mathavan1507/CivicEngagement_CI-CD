package com.civic.policy.entity;

import com.civic.auth.entity.ContributorType;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Policy {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String title;

	@Lob
	@Column(columnDefinition = "TEXT")
	private String description;

	private String category;
	private String tags;
	private int views = 0;
	private LocalDateTime createdAt = LocalDateTime.now();
	private LocalDateTime updatedAt = LocalDateTime.now();

	/**
	 * Which contributor type this policy is intended for. NULL means it is visible
	 * to all contributors. EDUCATOR / CIVIC_ORGANIZATION / CIVIC_MANAGEMENT
	 * restricts visibility to contributors whose contributorType matches.
	 */
	@Enumerated(EnumType.STRING)
	@Column(name = "contribution_type")
	private ContributorType contributionType;

	// ── Getters & Setters ──────────────────────────────────────────────────

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String t) {
		this.title = t;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String d) {
		this.description = d;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String c) {
		this.category = c;
	}

	public String getTags() {
		return tags;
	}

	public void setTags(String t) {
		this.tags = t;
	}

	public int getViews() {
		return views;
	}

	public void setViews(int v) {
		this.views = v;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime d) {
		this.createdAt = d;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime d) {
		this.updatedAt = d;
	}

	public ContributorType getContributionType() {
		return contributionType;
	}

	public void setContributionType(ContributorType ct) {
		this.contributionType = ct;
	}
}
