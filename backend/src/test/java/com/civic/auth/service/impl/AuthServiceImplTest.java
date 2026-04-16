package com.civic.auth.service.impl;
 
import com.civic.auth.dto.AuthResponse;
import com.civic.auth.dto.RegisterRequest;
import com.civic.auth.entity.ContributorType;
import com.civic.auth.entity.Role;
import com.civic.auth.entity.Users;
import com.civic.auth.repository.UserRepository;
import com.civic.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
 
import java.util.Optional;
 
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
 
@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {
 
    @InjectMocks
    private AuthServiceImpl authService;
 
    @Mock private UserRepository repo;
    @Mock private PasswordEncoder encoder;
    @Mock private JwtUtil jwtUtil;
 
    private RegisterRequest registerRequest;
    private Users mockUser;
 
    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setName("John Doe");
        registerRequest.setEmail("john@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setRole("USER");
 
        mockUser = new Users();
        mockUser.setId(1L);
        mockUser.setName("John Doe");
        mockUser.setEmail("john@example.com");
        mockUser.setPassword("encodedPassword");
        mockUser.setRole(Role.USER);
        mockUser.setActive(true);
    }
 
    // ── Register Tests ──────────────────────────────────────────────────
 
    @Test
    void register_success_returnsMessage() {
        when(repo.existsByEmail("john@example.com")).thenReturn(false);
        when(encoder.encode("password123")).thenReturn("encodedPassword");
 
        String result = authService.register(registerRequest);
 
        assertEquals("Registered successfully", result);
        verify(repo, times(1)).save(any(Users.class));
    }
 
    @Test
    void register_duplicateEmail_throwsException() {
        when(repo.existsByEmail("john@example.com")).thenReturn(true);
 
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.register(registerRequest));
        assertEquals("Email already registered", ex.getMessage());
        verify(repo, never()).save(any());
    }
 
    @Test
    void register_asContributor_setsRoleCorrectly() {
        registerRequest.setRole("CONTRIBUTOR");
        registerRequest.setContributorType("EDUCATOR");
 
        when(repo.existsByEmail(any())).thenReturn(false);
        when(encoder.encode(any())).thenReturn("encoded");
 
        ArgumentCaptor<Users> captor = ArgumentCaptor.forClass(Users.class);
        authService.register(registerRequest);
 
        verify(repo).save(captor.capture());
        Users saved = captor.getValue();
        assertEquals(Role.CONTRIBUTOR, saved.getRole());
        assertEquals(ContributorType.EDUCATOR, saved.getContributorType());
    }
 
    @Test
    void register_invalidContributorType_throwsException() {
        registerRequest.setRole("CONTRIBUTOR");
        registerRequest.setContributorType("INVALID_TYPE");
 
        when(repo.existsByEmail(any())).thenReturn(false);
        when(encoder.encode(any())).thenReturn("encoded");
 
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.register(registerRequest));
        assertTrue(ex.getMessage().contains("Invalid contributor type"));
    }
 
    // ── Login Tests ─────────────────────────────────────────────────────
 
    @Test
    void login_success_returnsAuthResponse() {
        when(repo.findByEmail("john@example.com")).thenReturn(Optional.of(mockUser));
        when(encoder.matches("password123", "encodedPassword")).thenReturn(true);
        when(jwtUtil.generateToken(mockUser)).thenReturn("mock.jwt.token");
 
        AuthResponse response = authService.login("john@example.com", "password123");
 
        assertNotNull(response);
        assertEquals("mock.jwt.token", response.getToken());
        assertEquals("USER", response.getRole());
    }
 
    @Test
    void login_userNotFound_throwsException() {
        when(repo.findByEmail(any())).thenReturn(Optional.empty());
 
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login("unknown@example.com", "pass"));
        assertEquals("User not found", ex.getMessage());
    }
 
    @Test
    void login_deactivatedUser_throwsException() {
        mockUser.setActive(false);
        when(repo.findByEmail("john@example.com")).thenReturn(Optional.of(mockUser));
 
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login("john@example.com", "password123"));
        assertTrue(ex.getMessage().contains("deactivated"));
    }
 
    @Test
    void login_wrongPassword_throwsException() {
        when(repo.findByEmail("john@example.com")).thenReturn(Optional.of(mockUser));
        when(encoder.matches("wrongPass", "encodedPassword")).thenReturn(false);
 
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login("john@example.com", "wrongPass"));
        assertEquals("Invalid credentials", ex.getMessage());
    }
 
    @Test
    void login_trimAndLowercasesEmail() {
        when(repo.findByEmail("john@example.com")).thenReturn(Optional.of(mockUser));
        when(encoder.matches(any(), any())).thenReturn(true);
        when(jwtUtil.generateToken(any())).thenReturn("token");
 
        authService.login("  JOHN@EXAMPLE.COM  ", "password123");
 
        verify(repo).findByEmail("john@example.com");
    }
}
 