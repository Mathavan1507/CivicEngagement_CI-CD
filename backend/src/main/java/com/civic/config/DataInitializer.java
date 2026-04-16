package com.civic.config;
 
import com.civic.auth.entity.Role;
import com.civic.auth.entity.Users;
import com.civic.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
 

@Component
public class DataInitializer implements CommandLineRunner {
 
    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder encoder;
 
    @Override
    public void run(String... args) {
        if (!userRepo.existsByEmail("admin@civic.com")) {
            Users admin = new Users();
            admin.setName("Super Admin");
            admin.setEmail("admin@civic.com");
            admin.setPassword(encoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            admin.setActive(true);
            userRepo.save(admin);
            System.out.println("✅ Default admin created → admin@civic.com / admin123");
        }
    }
}
 