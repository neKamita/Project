package uz.pdp.project.service;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import uz.pdp.project.dto.SignInDTO;
import uz.pdp.project.dto.SignUpDTO;
import uz.pdp.project.entity.User;
import uz.pdp.project.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;
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
        validatePassword(signUpDTO.getPassword());
    }

    private void validatePassword(String password) {
        if (password.length() < 8) {
            throw new RuntimeException("Пароль должен содержать минимум 8 символов");
        }
        if (!password.matches(".*[A-Z].*")) {
            throw new RuntimeException("Пароль должен содержать заглавные буквы");
        }
        if (!password.matches(".*[a-z].*")) {
            throw new RuntimeException("Пароль должен содержать строчные буквы");
        }
        if (!password.matches(".*[!@#$%^&*(),.?\":{}|<>].*")) {
            throw new RuntimeException("Пароль должен содержать специальные символы");
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

    @Transactional
    public void updateUserRole(String username, String newRole) {
        userRepository.findByUsername(username)
                .ifPresent(user -> {
                    user.setRole(newRole);
                    userRepository.save(user);
                });
    }

    public int getFollowersCount(Integer userId) {
        return userRepository.countFollowersByUserId(userId);
    }

    public int getPostsCount(Integer userId) {
        return userRepository.countPostsByUserId(userId);
    }

    public int getFollowingCount(Integer userId) {
        return userRepository.countFollowingByUserId(userId);
    }

    public double getChefRating(Integer userId) {
        return 4.0 + (userId % 10) / 10.0;
    }

    @Transactional
    public boolean updateProfile(Integer userId, String firstName, String lastName, String email,
            String specializations, String experience, String about) {
        return userRepository.findById(userId)
                .map(user -> {
                    user.setFirstName(firstName);
                    user.setLastName(lastName);
                    user.setEmail(email);
                    user.setSpecializations(specializations);
                    user.setExperience(experience);
                    user.setAbout(about);
                    userRepository.save(user);
                    return true;
                })
                .orElse(false);
    }

    public String getUserRole(Integer userId) {
        return userRepository.findById(userId)
                .map(User::getRole)
                .orElse("ROLE_USER");
    }

    public User getUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}