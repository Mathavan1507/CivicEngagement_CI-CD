package com.civic.auth.dto;

public class AuthResponse {
	private String token;
	private String role;
	private String contributorType;
	private String name;
	private Long userId;

	public AuthResponse() {
	}

	public AuthResponse(String token, String role, String ct, String name, Long userId) {
		this.token = token;
		this.role = role;
		this.contributorType = ct;
		this.name = name;
		this.userId = userId;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String t) {
		this.token = t;
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

	public String getName() {
		return name;
	}

	public void setName(String n) {
		this.name = n;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long id) {
		this.userId = id;
	}
}
