package com.civic.security;
 
import com.civic.auth.service.UserDetailsServiceImpl;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
 
import java.io.IOException;
 
@Component
public class JwtFilter extends OncePerRequestFilter {
 
    @Autowired private JwtUtil jwtUtil;
    @Autowired private UserDetailsServiceImpl uds;
 
    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain)
            throws ServletException, IOException {
 
        // Skip preflight
        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            chain.doFilter(req, res);
            return;
        }
 
        String header = req.getHeader("Authorization");
 
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                String email = jwtUtil.extractUsername(token);
                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails ud = uds.loadUserByUsername(email);
                    if (jwtUtil.validateToken(token, ud.getUsername())) {
                        var auth = new UsernamePasswordAuthenticationToken(
                                ud, null, ud.getAuthorities());
                        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
            } catch (Exception e) {
                System.out.println("JWT Error: " + e.getMessage());
            }
        }
 
        chain.doFilter(req, res);
    }
}
 