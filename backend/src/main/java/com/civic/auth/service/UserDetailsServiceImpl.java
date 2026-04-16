package com.civic.auth.service;

import com.civic.auth.entity.Users;
import com.civic.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
	@Autowired
	private UserRepository repo;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		Users user = repo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Not found: " + email));
		if (!user.isActive())
			throw new UsernameNotFoundException("Account deactivated");
		return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(),
				Collections.singleton(() -> "ROLE_" + user.getRole().name()));
	}
}
