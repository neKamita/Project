package uz.pdp.project.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.servlet.http.HttpSession;
import uz.pdp.project.entity.User;
import uz.pdp.project.service.UserService;

@Controller
@RequestMapping("/profile")
public class ProfileController {

    @Autowired
    private UserService userService;

    @GetMapping
    public String getProfilePage(HttpSession session, Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User) {
            User userFromAuth = (User) auth.getPrincipal();
            User user = userService.getUserById(userFromAuth.getId());

            model.addAttribute("firstName", user.getFirstName());
            model.addAttribute("lastName", user.getLastName());
            model.addAttribute("email", user.getEmail());
            model.addAttribute("username", user.getUsername());
            model.addAttribute("role", user.getRole());
            model.addAttribute("specializations", user.getSpecializations());
            model.addAttribute("experience", user.getExperience());
            model.addAttribute("about", user.getAbout());

            model.addAttribute("posts", userService.getPostsCount(user.getId()));
            model.addAttribute("following", userService.getFollowingCount(user.getId()));

            if ("ROLE_CHEF".equals(user.getRole())) {
                model.addAttribute("followers", userService.getFollowersCount(user.getId()));
                model.addAttribute("rating", userService.getChefRating(user.getId()));
            }

            session.setAttribute("username", user.getUsername());
            session.setAttribute("userRole", user.getRole());
            session.setAttribute("userId", user.getId());
        }

        return "profile";
    }

    @GetMapping("/api/user/profile-data")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getProfileData() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();

        if (auth != null && auth.getPrincipal() instanceof User) {
            User user = userService.getUserById(((User) auth.getPrincipal()).getId());

            response.put("success", true);
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());
            response.put("email", user.getEmail());
            response.put("username", user.getUsername());
            response.put("role", user.getRole());
            response.put("specializations", user.getSpecializations());
            response.put("experience", user.getExperience());
            response.put("about", user.getAbout());

            return ResponseEntity.ok(response);
        }

        response.put("success", false);
        response.put("message", "User not authenticated");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
}
