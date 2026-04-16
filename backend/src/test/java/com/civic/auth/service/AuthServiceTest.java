package com.civic.auth.service;
 
import com.civic.auth.entity.Users;
import com.civic.auth.repository.UserRepository;
import com.civic.auth.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.security.crypto.password.PasswordEncoder;
 
import java.util.Optional;
 
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
 
@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class AuthServiceTest {
 
    @InjectMocks
    private AuthServiceImpl authService;
 
    @Mock
    private UserRepository userRepository;
 
    @Mock
    private PasswordEncoder passwordEncoder;
 
   
    @Test
    void testFindByEmail() {
        Users user = new Users();
        user.setEmail("test@mail.com");
 
        when(userRepository.findByEmail("test@mail.com"))
                .thenReturn(Optional.of(user));
 
        Optional<Users> result = userRepository.findByEmail("test@mail.com");
 
        assertTrue(result.isPresent());
    }
}
 