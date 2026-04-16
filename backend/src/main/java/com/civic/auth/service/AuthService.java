package com.civic.auth.service;

import org.springframework.stereotype.Service;

import com.civic.auth.dto.AuthResponse;
import com.civic.auth.dto.RegisterRequest;

@Service
public interface AuthService {
	String register(RegisterRequest request);

	AuthResponse login(String email, String password);
}