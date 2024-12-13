package uz.pdp.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import uz.pdp.project.entity.Recipe;
import uz.pdp.project.entity.User;
import uz.pdp.project.repository.RecipeRepository;
import uz.pdp.project.service.UserService;

import java.util.List;
import java.util.stream.Collectors;

@Controller
public class IndexController {

    @Autowired
    private UserService userService;

    @Autowired
    private RecipeRepository recipeRepository;

    @GetMapping("/")
    public String getIndexPage(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            String username = auth.getName();
            Long currentUserId = userService.getUserIdByUsername(username);
            String userRole = userService.getUserRoleByUsername(username);

            model.addAttribute("userRole", userRole);
            model.addAttribute("currentUserId", currentUserId);
        } else {
            model.addAttribute("userRole", "ROLE_USER");
            model.addAttribute("currentUserId", null);
        }

        // Fetch all enabled recipes
        List<Recipe> recipes = recipeRepository.findByEnabledTrue();

        model.addAttribute("recipes", recipes);
        return "index";
    }
}
