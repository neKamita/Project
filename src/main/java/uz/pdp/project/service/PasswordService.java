package uz.pdp.project.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PasswordService {
    private final BCryptPasswordEncoder passwordEncoder;

    public PasswordService() {
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public String hashPassword(String rawPassword) {
        if (rawPassword == null) {
            log.error("Cannot encode null password");
            throw new IllegalArgumentException("Password cannot be null");
        }

        try {
            String encodedPassword = passwordEncoder.encode(rawPassword);
            log.debug("Password encoded successfully");
            return encodedPassword;
        } catch (Exception e) {
            log.error("Error during password encoding", e);
            throw new RuntimeException("Password encoding failed", e);
        }
    }

    public boolean isPasswordValid(String rawPassword, String encodedPassword) {
        if (rawPassword == null || encodedPassword == null) {
            log.error("Password comparison failed: null input");
            return false;
        }

        try {
            boolean result = passwordEncoder.matches(rawPassword, encodedPassword);
            log.debug("Password match result: {}", result);
            return result;
        } catch (Exception e) {
            log.error("Error during password matching", e);
            return false;
        }
    }
}
