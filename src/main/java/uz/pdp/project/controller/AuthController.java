package uz.pdp.project.controller;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ResponseBody;
import uz.pdp.project.dto.SignInDTO;
import uz.pdp.project.dto.SignUpDTO;
import uz.pdp.project.entity.User;
import uz.pdp.project.service.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Collections;

@Controller
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final UserService userService;

    @GetMapping("/signin")
    public String getSignInPage() {
        return "signin"; // This will render signin.html template
    }

    @PostMapping(value = "/signin", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> signIn(
            @Valid @RequestBody SignInDTO signInDTO,
            BindingResult bindingResult,
            HttpSession session) {

        // Enhanced logging and validation
        log.error("SignIn Request Details:");
        log.error("Email: {}", signInDTO != null ? signInDTO.getEmail() : "NULL");
        log.error("Password Provided: {}", signInDTO != null && signInDTO.getPassword() != null ? "YES" : "NO");

        // Validate input
        if (signInDTO == null) {
            log.error("Received null SignInDTO");
            return ResponseEntity
                    .badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(createErrorResponse("Invalid request: SignInDTO is null", true));
        }

        // Comprehensive validation logging
        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.toList());

            log.error("Validation errors: {}", errors);

            return ResponseEntity
                    .badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(createErrorResponse("Validation failed", true, errors));
        }

        try {
            // Explicit null checks
            if (signInDTO.getEmail() == null || signInDTO.getPassword() == null) {
                log.error("Null email or password received");
                return ResponseEntity
                        .badRequest()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(createErrorResponse("Email и пароль обязательны", true,
                                "Пожалуйста, введите email и пароль"));
            }

            Optional<User> userOptional = userService.authenticateUser(signInDTO);

            if (userOptional.isPresent()) {
                User user = userOptional.get();

                // Defensive null checks before accessing user properties
                String firstName = Optional.ofNullable(user.getFirstName()).orElse("Пользователь");
                String username = Optional.ofNullable(user.getUsername()).orElse("unknown");
                String email = Optional.ofNullable(user.getEmail()).orElse(signInDTO.getEmail());
                String role = Optional.ofNullable(user.getRole()).orElse("USER");

                session.setAttribute("userId", user.getId());
                session.setAttribute("userEmail", email);
                session.setAttribute("userRole", role);

                log.info("User authenticated successfully: {}", email);

                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(createSuccessResponse(firstName, username, email));
            }

            log.warn("Login failed for email: {}", signInDTO.getEmail());
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(createErrorResponse("Неверный email или пароль", true,
                            "Проверьте правильность введенных данных"));

        } catch (Exception e) {
            // Log the full stack trace with more context
            log.error("Authentication error: {}", e.getMessage(), e);

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(createErrorResponse("Ошибка аутентификации", true,
                            Optional.ofNullable(e.getMessage())
                                    .filter(msg -> !msg.isEmpty())
                                    .orElse("Произошла непредвиденная ошибка")));
        }
    }

    @GetMapping("/signup")
    public String getSignUpPage() {
        return "signup"; // This will render signup.html template
    }

    @PostMapping(value = "/signup", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> signUp(
            @Valid @RequestBody Map<String, String> payload,
            BindingResult bindingResult) {

        log.info("Signup payload: {}", payload);

        // Convert payload to SignUpDTO
        SignUpDTO signUpDTO = convertPayloadToSignUpDTO(payload);

        // Validate input
        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.toList());

            log.error("Signup validation errors: {}", errors);

            return ResponseEntity
                    .badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(createErrorResponse("Validation failed", true, errors));
        }

        try {
            // Attempt user registration
            User registeredUser = userService.registerUser(signUpDTO);

            log.info("User registered successfully: {}", registeredUser.getEmail());

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(createSuccessResponse(null, registeredUser.getUsername(), registeredUser.getEmail()));
        } catch (RuntimeException e) {
            log.error("Registration error", e);

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(createErrorResponse("Ошибка регистрации", true,
                            Optional.ofNullable(e.getMessage())
                                    .orElse("Произошла непредвиденная ошибка")));
        } catch (Exception e) {
            log.error("Registration failed: {}", e.getMessage());

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(createErrorResponse("Неизвестная ошибка при регистрации", true,
                            Optional.ofNullable(e.getMessage())
                                    .orElse("Произошла непредвиденная ошибка")));
        }
    }

    private SignUpDTO convertPayloadToSignUpDTO(Map<String, String> payload) {
        // Log the entire payload for debugging
        log.info("Signup Payload: {}", payload);

        // Validate that all required fields are present
        String[] requiredFields = { "username", "firstName", "email", "password" };
        for (String field : requiredFields) {
            if (!payload.containsKey(field) || payload.get(field) == null || payload.get(field).trim().isEmpty()) {
                log.error("Missing or empty required field: {}", field);
                throw new IllegalArgumentException("Missing required field: " + field);
            }
        }

        SignUpDTO signUpDTO = new SignUpDTO();
        signUpDTO.setUsername(payload.get("username").trim());
        signUpDTO.setFirstName(payload.get("firstName").trim());

        // Optional fields
        if (payload.containsKey("lastName") && payload.get("lastName") != null) {
            signUpDTO.setLastName(payload.get("lastName").trim());
        }

        signUpDTO.setEmail(payload.get("email").trim());
        signUpDTO.setPassword(payload.get("password"));

        return signUpDTO;
    }

    @PostMapping(value = "/logout", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(createSuccessResponse(null, null, null));
    }

    @GetMapping("/profile")
    public String getProfilePage() {
        return "profile"; // This will render profile.html template
    }

    @GetMapping(value = "/check-session", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> checkSession(HttpSession session) {
        String username = (String) session.getAttribute("username");
        if (username != null) {
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(createSuccessResponse(null, username, null));
        }
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(createErrorResponse("Not authenticated", true));
    }

    @GetMapping(value = "/check-page", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> checkPage() {
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(createSuccessResponse(null, null, null));
    }

    // Helper method to create error response map
    private Map<String, Object> createErrorResponse(String message, boolean error) {
        return createErrorResponse(message, error, null);
    }

    private Map<String, Object> createErrorResponse(String message, boolean error, Object details) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", message != null ? message : "Unknown error");
        response.put("error", error);

        if (details != null) {
            response.put("details", details);
        }

        response.put("username", null);
        response.put("email", null);
        response.put("redirect", null);

        return response;
    }

    // Helper method to create success response map
    private Map<String, Object> createSuccessResponse(String firstName, String username, String email) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", firstName != null ? "Добро пожаловать, " + firstName + "!" : "Success");
        response.put("username", username != null ? username : "unknown");
        response.put("email", email);
        response.put("redirect", "/");
        response.put("error", false);
        response.put("details", null);

        return response;
    }
}
