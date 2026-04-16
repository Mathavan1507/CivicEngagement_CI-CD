package com.civic.auth.dto;

public class UserDto {
	private Long id;
	private String name;
	private String email;
	private String role;
	private String contributorType;
	private boolean active;
	private String createdAt;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String n) {
		this.name = n;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String e) {
		this.email = e;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String r) {
		this.role = r;
	}

	public String getContributorType() {
		return contributorType;
	}

	public void setContributorType(String ct) {
		this.contributorType = ct;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean a) {
		this.active = a;
	}

	public String getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(String d) {
		this.createdAt = d;
	}
}
