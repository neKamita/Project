package uz.pdp.project.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import uz.pdp.project.dto.ProfileUpdateRequestDTO;
import uz.pdp.project.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/toggle-role")
    public ResponseEntity<Map<String, Object>> toggleRole(HttpSession session) {
        String currentRole = (String) session.getAttribute("userRole");
        String newRole = "ROLE_USER".equals(currentRole) ? "ROLE_CHEF" : "ROLE_USER";

        // Update in database
        String username = (String) session.getAttribute("username");
        userService.updateUserRole(username, newRole);

        // Update session
        session.setAttribute("userRole", newRole);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "newRole", newRole,
                "message", "ROLE_CHEF".equals(newRole) ? "Вы стали поваром!" : "Вы стали обычным пользователем"));
    }

    @PostMapping("/update-profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @RequestBody ProfileUpdateRequestDTO request,
            HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Пользователь не авторизован"));
        }

        boolean updated = userService.updateProfile(
                userId,
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                request.getSpecializations(),
                request.getExperience(),
                request.getAbout());

        if (updated) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "firstName", request.getFirstName(),
                    "lastName", request.getLastName(),
                    "email", request.getEmail(),
                    "specializations", request.getSpecializations(),
                    "experience", request.getExperience(),
                    "about", request.getAbout(),
                    "message", "Профиль успешно обновлен"));
        } else {
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "Не удалось обновить профиль"));
        }
    }

    @GetMapping("/api/user/role")
    public ResponseEntity<Map<String, Object>> getUserRole(HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Пользователь не авторизован"));
        }

        String role = userService.getUserRole(userId);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "role", role));
    }
}