package uz.pdp.project.service;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import uz.pdp.project.dto.SignInDTO;
import uz.pdp.project.dto.SignUpDTO;
import uz.pdp.project.entity.User;
import uz.pdp.project.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    public User registerUser(SignUpDTO signUpDTO) {
        log.debug("Attempting to register new user with email: {}", signUpDTO.getEmail());

        validateSignUpDTO(signUpDTO);

        User user = User.builder()
                .username(signUpDTO.getUsername())
                .firstName(signUpDTO.getFirstName())
                .lastName(signUpDTO.getLastName())
                .email(signUpDTO.getEmail())
                .password(passwordEncoder.encode(signUpDTO.getPassword()))
                .role("USER")
                .build();

        return userRepository.save(user);
    }

    public Optional<User> authenticateUser(SignInDTO signInDTO) {
        log.debug("Attempting to authenticate user with email: {}", signInDTO.getEmail());

        return userRepository.findByEmail(signInDTO.getEmail())
                .filter(user -> passwordEncoder.matches(signInDTO.getPassword(), user.getPassword()));
    }

    private void validateSignUpDTO(SignUpDTO signUpDTO) {
        // Check for existing email
        if (userRepository.existsByEmail(signUpDTO.getEmail().toLowerCase())) {
            log.error("Email already exists: {}", signUpDTO.getEmail());
            throw new RuntimeException("User with this email already exists");
        }

        // Check for existing username
        if (userRepository.existsByUsername(signUpDTO.getUsername().toLowerCase())) {
            log.error("Username already exists: {}", signUpDTO.getUsername());
            throw new RuntimeException("Username is already taken");
        }

        // Validate password requirements
        if (signUpDTO.getPassword().length() < 8) {
            log.error("Password too short for user: {}", signUpDTO.getUsername());
            throw new RuntimeException("Password must be at least 8 characters long");
        }
    }

    public boolean updatePassword(String email, String newPassword) {
        log.debug("Attempting to update password for user with email: {}", email);

        return userRepository.findByEmail(email)
                .map(user -> {
                    user.setPassword(passwordEncoder.encode(newPassword));
                    userRepository.save(user);
                    log.info("Successfully updated password for user with email: {}", email);
                    return true;
                })
                .orElse(false);
    }
}