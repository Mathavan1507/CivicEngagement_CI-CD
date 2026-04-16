package com.civic.security;
 
import com.civic.auth.entity.Users;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
 
import java.security.Key;
import java.util.Date;
 
@Component
public class JwtUtil {
 
    @Value("${jwt.secret}")
    private String secret;
 
    @Value("${jwt.expiration}")
    private long expiration;
 
    private Key getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
 
    public String generateToken(Users user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("userId", user.getId())
                .claim("role", user.getRole().name())
                .claim("name", user.getName())
                .claim("contributorType",
                        user.getContributorType() != null ? user.getContributorType().name() : null)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }
 
    public Claims extractAll(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
 
    public String extractUsername(String token) {
        return extractAll(token).getSubject();
    }
 
    public Long extractUserId(String token) {
        return extractAll(token).get("userId", Long.class);
    }
 
    public String extractRole(String token) {
        return (String) extractAll(token).get("role");
    }
 
    public boolean validateToken(String token, String username) {
        Claims claims = extractAll(token);
        return claims.getSubject().equals(username)
                && claims.getExpiration().after(new Date());
    }
}
 