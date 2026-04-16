package com.civic.security;
 
import com.civic.auth.entity.ContributorType;
import com.civic.auth.entity.Role;
import com.civic.auth.entity.Users;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
 
import static org.junit.jupiter.api.Assertions.*;
 
class JwtUtilTest {
 
    private JwtUtil jwtUtil;
 
    // Must be ≥ 256 bits (32 chars) for HS256
    private static final String SECRET =
            "civic-engagement-super-secret-key-12345678";
    private static final long EXPIRATION = 3_600_000L; // 1 hour
 
    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", SECRET);
        ReflectionTestUtils.setField(jwtUtil, "expiration", EXPIRATION);
    }
 
    private Users makeUser() {
        Users user = new Users();
        user.setId(42L);
        user.setEmail("alice@example.com");
        user.setName("Alice");
        user.setRole(Role.USER);
        return user;
    }
 
    @Test
    void generateToken_notNull() {
        String token = jwtUtil.generateToken(makeUser());
        assertNotNull(token);
        assertFalse(token.isBlank());
    }
 
    @Test
    void extractUsername_returnsEmail() {
        String token = jwtUtil.generateToken(makeUser());
        assertEquals("alice@example.com", jwtUtil.extractUsername(token));
    }
 
    @Test
    void extractUserId_returnsCorrectId() {
        String token = jwtUtil.generateToken(makeUser());
        assertEquals(42L, jwtUtil.extractUserId(token));
    }
 
    @Test
    void extractRole_returnsRoleName() {
        String token = jwtUtil.generateToken(makeUser());
        assertEquals("USER", jwtUtil.extractRole(token));
    }
 
    @Test
    void validateToken_validToken_returnsTrue() {
        String token = jwtUtil.generateToken(makeUser());
        assertTrue(jwtUtil.validateToken(token, "alice@example.com"));
    }
 
    @Test
    void validateToken_wrongUsername_returnsFalse() {
        String token = jwtUtil.generateToken(makeUser());
        assertFalse(jwtUtil.validateToken(token, "other@example.com"));
    }
 
    @Test
    void extractAll_contributorTypeClaim_nullWhenNotSet() {
        String token = jwtUtil.generateToken(makeUser());
        Claims claims = jwtUtil.extractAll(token);
        assertNull(claims.get("contributorType"));
    }
 
    @Test
    void extractAll_contributorTypeClaim_presentWhenSet() {
        Users user = makeUser();
        user.setRole(Role.CONTRIBUTOR);
        user.setContributorType(ContributorType.EDUCATOR);
 
        String token = jwtUtil.generateToken(user);
        Claims claims = jwtUtil.extractAll(token);
        assertEquals("EDUCATOR", claims.get("contributorType"));
    }
 
    @Test
    void generateToken_expiredToken_failsValidation() throws InterruptedException {
        ReflectionTestUtils.setField(jwtUtil, "expiration", 1L); // 1 ms
        String token = jwtUtil.generateToken(makeUser());
        Thread.sleep(10);
 
        assertThrows(Exception.class,
                () -> jwtUtil.validateToken(token, "alice@example.com"));
    }
}