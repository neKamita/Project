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

    @Autowired
    private PasswordService passwordService;

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

            // Encode password securely
            String hashedPassword = passwordService.hashPassword(signUpDTO.getPassword());
            user.setPassword(hashedPassword);

            User savedUser = userRepository.save(user);
            log.info("User registered successfully: {}", savedUser.getEmail());
            return savedUser;

        } catch (Exception e) {
            log.error("Error during user registration", e);
            throw new RuntimeException("Registration failed", e);
        }
    }

    public Optional<User> authenticateUser(SignInDTO signInDTO) {
        log.info("Authenticating user: {}", signInDTO);

        // Validate input
        if (signInDTO == null) {
            log.error("SignInDTO is null");
            return Optional.empty();
        }

        // Validate email
        if (signInDTO.getEmail() == null || signInDTO.getEmail().trim().isEmpty()) {
            log.error("Email is null or empty");
            return Optional.empty();
        }

        // Validate password
        if (signInDTO.getPassword() == null || signInDTO.getPassword().trim().isEmpty()) {
            log.error("Password is null or empty");
            return Optional.empty();
        }

        try {
            // Find user by email
            Optional<User> userOptional = userRepository.findByEmailIgnoreCase(signInDTO.getEmail());

            if (userOptional.isEmpty()) {
                log.warn("No user found with email: {}", signInDTO.getEmail());
                return Optional.empty();
            }

            User user = userOptional.get();

            // Log user details for debugging
            log.debug("User found - ID: {}, Username: {}, Email: {}, Stored Password: {}",
                    user.getId(), user.getUsername(), user.getEmail(),
                    user.getPassword() != null ? "[PROTECTED]" : "null");

            // Check if password matches
            boolean isPasswordMatch = passwordService.isPasswordValid(
                    signInDTO.getPassword(),
                    user.getPassword());

            log.info("Password match for {}: {}", signInDTO.getEmail(), isPasswordMatch);

            if (!isPasswordMatch) {
                log.warn("Password mismatch for user: {}", signInDTO.getEmail());
                return Optional.empty();
            }

            return Optional.of(user);

        } catch (Exception e) {
            log.error("Unexpected error during authentication for email: {}",
                    signInDTO.getEmail(), e);
            throw new RuntimeException("Authentication failed", e);
        }
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
                    user.setPassword(passwordService.hashPassword(newPassword));
                    userRepository.save(user);
                    return true;
                })
                .orElse(false);
    }

    private void validateSignUpDTO(SignUpDTO signUpDTO) {
        // Add validation logic here if needed
    }
}
