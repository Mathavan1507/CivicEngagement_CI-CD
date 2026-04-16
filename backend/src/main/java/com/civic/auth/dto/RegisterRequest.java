package com.civic.auth.dto;

public class RegisterRequest {
	private String name;
	private String email;
	private String password;
	private String role; // "USER" or "CONTRIBUTOR"
	private String contributorType; // "EDUCATOR","CIVIC_ORGANIZATION","CIVIC_MANAGEMENT"

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

	public String getPassword() {
		return password;
	}

	public void setPassword(String p) {
		this.password = p;
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
}
