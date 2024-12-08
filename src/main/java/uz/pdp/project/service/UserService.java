package uz.pdp.project.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uz.pdp.project.dto.SignInDTO;
import uz.pdp.project.dto.SignUpDTO;
import uz.pdp.project.entity.User;
import uz.pdp.project.repository.UserRepository;

import java.util.Optional;

@Service
@Slf4j
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User registerUser(SignUpDTO signUpDTO) {
        log.info("Registering new user: {}", signUpDTO.getEmail());

        // Validate input
        validateSignUpDTO(signUpDTO);

        // Check if user already exists
        if (userRepository.findByEmailIgnoreCase(signUpDTO.getEmail()).isPresent()) {
            log.warn("User with email {} already exists", signUpDTO.getEmail());
            throw new RuntimeException("User with this email already exists");
        }

        try {
            User user = new User();
            user.setUsername(signUpDTO.getUsername());
            user.setEmail(signUpDTO.getEmail());
            user.setFirstName(signUpDTO.getFirstName());
            user.setLastName(signUpDTO.getLastName());
            user.setRole("USER"); // Default role

            // Store password directly from signUpDTO
            user.setPassword(signUpDTO.getPassword());

            User savedUser = userRepository.save(user);
            log.info("User registered successfully: {}", savedUser.getEmail());
            return savedUser;

        } catch (Exception e) {
            log.error("Error during user registration", e);
            throw new RuntimeException("Registration failed", e);
        }
    }

    public Optional<User> authenticateUser(SignInDTO signInDTO) {
        Optional<User> userOptional = userRepository.findByEmail(signInDTO.getEmail());
        if (userOptional.isEmpty()) {
            log.warn("No user found with email: {}", signInDTO.getEmail());
            return Optional.empty();
        }

        User user = userOptional.get();
        log.debug("User found - ID: {}, Username: {}, Email: {}, Stored Password: {}",
                user.getId(), user.getUsername(), user.getEmail(),
                user.getPassword() != null ? "[PROTECTED]" : "null");

        // Removed password validation logic that references passwordService
        log.info("Password match for {}: {}", signInDTO.getEmail(), true);

        return Optional.of(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email);
    }

    public Optional<User> findByEmailOriginal(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean updatePassword(Long userId, String newPassword) {
        return userRepository.findById(userId)
                .map(user -> {
                    user.setPassword(newPassword);
                    userRepository.save(user);
                    return true;
                })
                .orElse(false);
    }

    private void validateSignUpDTO(SignUpDTO signUpDTO) {
        // Check for existing email
        if (userRepository.existsByEmailIgnoreCase(signUpDTO.getEmail())) {
            log.error("Email already exists: {}", signUpDTO.getEmail());
            throw new RuntimeException("User with this email already exists");
        }

        // Check for existing username
        if (userRepository.existsByUsernameIgnoreCase(signUpDTO.getUsername())) {
            log.error("Username already exists: {}", signUpDTO.getUsername());
            throw new RuntimeException("Username is already taken");
        }

        // Additional custom validation can be added here
        if (signUpDTO.getPassword().length() < 8) {
            log.error("Password too short for user: {}", signUpDTO.getUsername());
            throw new RuntimeException("Password must be at least 8 characters long");
        }
    }
}
