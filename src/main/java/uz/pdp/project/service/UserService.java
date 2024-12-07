package uz.pdp.project.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uz.pdp.project.dto.SignInDTO;
import uz.pdp.project.dto.SignUpDTO;
import uz.pdp.project.entity.User;
import uz.pdp.project.repository.UserRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordService passwordService;

    public boolean registerUser(SignUpDTO signUpDTO) {
        if (userRepository.existsByEmail(signUpDTO.getEmail())) {
            return false;
        }

        User user = new User();
        user.setUsername(signUpDTO.getUsername());
        user.setEmail(signUpDTO.getEmail());
        user.setPassword(passwordService.encodePassword(signUpDTO.getPassword()));
        user.setEnabled(true);

        userRepository.save(user);
        return true;
    }

    public Optional<User> authenticateUser(SignInDTO signInDTO) {
        return userRepository.findByEmail(signInDTO.getEmail())
                .filter(user -> passwordService.matches(signInDTO.getPassword(), user.getPassword()));
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean updatePassword(Long userId, String newPassword) {
        return userRepository.findById(userId)
                .map(user -> {
                    user.setPassword(passwordService.encodePassword(newPassword));
                    userRepository.save(user);
                    return true;
                })
                .orElse(false);
    }
}
