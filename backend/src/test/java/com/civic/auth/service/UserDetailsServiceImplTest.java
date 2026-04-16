package com.civic.auth.service;

import com.civic.auth.entity.Role;
import com.civic.auth.entity.Users;
import com.civic.auth.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;
    

    @Test
    void testLoadUserByUsername_userFoundAndActive() {
        Users user = new Users();
        user.setEmail("test@example.com");
        user.setPassword("password123");
        user.setRole(Role.ADMIN);
        user.setActive(true);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        UserDetails userDetails = userDetailsService.loadUserByUsername("test@example.com");

        assertNotNull(userDetails);
        assertEquals("test@example.com", userDetails.getUsername());
        assertEquals("password123", userDetails.getPassword());
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN")));
    }

    @Test
    void testLoadUserByUsername_userNotFound() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class,
                () -> userDetailsService.loadUserByUsername("missing@example.com"));
    }

    @Test
    void testLoadUserByUsername_userDeactivated() {
        Users user = new Users();
        user.setEmail("inactive@example.com");
        user.setPassword("password123");
        user.setRole(Role.USER);
        user.setActive(false);

        when(userRepository.findByEmail("inactive@example.com")).thenReturn(Optional.of(user));

        assertThrows(UsernameNotFoundException.class,
                () -> userDetailsService.loadUserByUsername("inactive@example.com"));
    }
}
