package uz.pdp.project.controller;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import uz.pdp.project.dto.SignInDTO;
import uz.pdp.project.dto.SignUpDTO;
import uz.pdp.project.service.UserService;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;

    @GetMapping("/signin")
    public String getSignInPage() {
        return "signin";
    }

    @GetMapping("/signup")
    public String getSignUpPage() {
        return "signup";
    }

    @PostMapping("/signin")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> signIn(
            @Valid @RequestBody SignInDTO signInDTO,
            HttpSession session) {
        return userService.authenticateUser(signInDTO)
                .map(user -> {
                    Map<String, Object> response = new HashMap<>();
                    session.setAttribute("userId", user.getId());
                    session.setAttribute("username", user.getUsername());

                    response.put("message", "Login successful");
                    response.put("redirect", "/profile");
                    response.put("username", user.getUsername());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of(
                                "message", "Invalid credentials",
                                "error", true)));
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signUp(
            @Valid @RequestBody SignUpDTO signUpDTO) {

        try {
            if (userService.registerUser(signUpDTO)) {
                return ResponseEntity.ok(Map.of(
                        "message", "Registration successful",
                        "redirect", "/auth/signin"));
            } else {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(Map.of(
                                "message", "Email already exists",
                                "error", true));
            }
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message", "Registration failed",
                            "error", true,
                            "details", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of(
                "message", "Logged out successfully",
                "redirect", "/auth/signin"));
    }

    @GetMapping("/profile")
    public String getProfilePage() {
        return "profile";
    }

    @GetMapping("/check-session")
    public ResponseEntity<Map<String, Object>> checkSession(HttpSession session) {
        String username = (String) session.getAttribute("username");
        if (username != null) {
            return ResponseEntity.ok(Map.of(
                    "authenticated", true,
                    "username", username));
        }
        return ResponseEntity.ok(Map.of(
                "authenticated", false));
    }
}
