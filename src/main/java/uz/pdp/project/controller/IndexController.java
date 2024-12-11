package uz.pdp.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import uz.pdp.project.entity.Recipe;
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

        // Fetch recipes with minimal data to avoid LOB streaming issues
        List<Recipe> recipes = recipeRepository.findByEnabledTrue().stream()
                .map(recipe -> {
                    Recipe minimalRecipe = new Recipe();
                    minimalRecipe.setId(recipe.getId());
                    minimalRecipe.setTitle(recipe.getTitle());
                    minimalRecipe.setImagePath(recipe.getImagePath());
                    minimalRecipe.setEnabled(recipe.isEnabled());
                    minimalRecipe.setUser(recipe.getUser());
                    return minimalRecipe;
                })
                .collect(Collectors.toList());

        model.addAttribute("recipes", recipes);
        return "index";
    }
}