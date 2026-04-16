package com.civic.auth.repository;

import com.civic.auth.entity.Role;
import com.civic.auth.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Long> {
	Optional<Users> findByEmail(String email);

	List<Users> findByRole(Role role);

	boolean existsByEmail(String email);

	long countByRole(Role role);
}