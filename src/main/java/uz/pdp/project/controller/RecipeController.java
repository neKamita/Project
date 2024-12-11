package uz.pdp.project.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import uz.pdp.project.entity.Recipe;
import uz.pdp.project.entity.User;
import uz.pdp.project.repository.RecipeRepository;
import uz.pdp.project.service.UserService;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.UUID;

import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class RecipeController {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private UserService userService;

    private static final String UPLOAD_DIR = "uploads/";

    private static final Logger logger = LoggerFactory.getLogger(RecipeController.class);

    @PostMapping("/add-recipe")
    public String addRecipe(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("ingredients") String ingredients,
            @RequestParam("steps") String steps,
            @RequestParam(value = "image", required = false) MultipartFile image,
            Model model,
            RedirectAttributes redirectAttributes) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            // Add explicit null and authentication checks
            if (auth == null || !auth.isAuthenticated()) {
                redirectAttributes.addFlashAttribute("error", "User not authenticated");
                return "redirect:/";
            }

            Object principal = auth.getPrincipal();
            if (!(principal instanceof User)) {
                redirectAttributes.addFlashAttribute("error", "Invalid user principal");
                return "redirect:/";
            }

            User currentUser = (User) principal;

            String imagePath = null;
            if (image != null && !image.isEmpty()) {
                try {
                    imagePath = uploadImage(image);
                } catch (IOException e) {
                    logger.error("Error uploading image", e);
                    redirectAttributes.addFlashAttribute("error", "Failed to upload image: " + e.getMessage());
                    return "redirect:/";
                }
            }

            Recipe recipe = new Recipe();
            recipe.setTitle(title);
            recipe.setDescription(description);
            recipe.setIngredients(ingredients);
            recipe.setSteps(steps);
            recipe.setImagePath(imagePath);
            recipe.setUser(currentUser);
            recipe.setEnabled(true);

            recipeRepository.save(recipe);

            redirectAttributes.addFlashAttribute("success", "Recipe added successfully!");
            return "redirect:/";
        } catch (Exception e) {
            logger.error("Error adding recipe", e);
            redirectAttributes.addFlashAttribute("error", "Failed to add recipe: " + e.getMessage());
            return "redirect:/";
        }
    }

    @GetMapping("/recipes")
    public String getRecipes(Model model) {
        model.addAttribute("recipes", recipeRepository.findAll());
        return "recipes";
    }

    @GetMapping("/recipe/{id}")
    public String getRecipeDetails(@PathVariable Long id, Model model) {
        Optional<Recipe> recipeOptional = recipeRepository.findById(id);
        if (recipeOptional.isPresent()) {
            model.addAttribute("recipe", recipeOptional.get());
            return "recipe-details";
        } else {
            model.addAttribute("error", "Recipe not found.");
            return "redirect:/";
        }
    }

    @PostMapping("/disable-recipe/{id}")
    public ResponseEntity<?> disableRecipe(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = getCurrentUserEmail(auth);
        User currentUser = userService.findByEmail(userEmail);

        Optional<Recipe> optionalRecipe = recipeRepository.findById(id);
        if (optionalRecipe.isPresent()) {
            Recipe recipe = optionalRecipe.get();

            if (!recipe.isEnabled()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Recipe is already disabled");
            }

            if (!recipe.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You can only disable your own recipes");
            }

            recipe.setEnabled(false);
            recipeRepository.save(recipe);

            logger.info("Recipe {} has been disabled by user {}", id, currentUser.getUsername());

            return ResponseEntity.ok().build();
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    private String uploadImage(MultipartFile image) throws IOException {
        // Ensure the upload directory exists
        Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        // Generate a unique filename to prevent overwriting
        String originalFilename = image.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        // Full path for the file
        Path targetLocation = uploadPath.resolve(uniqueFilename);

        // Copy file to the target location
        try (InputStream inputStream = image.getInputStream()) {
            Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
        }

        // Return the relative path for storing in database
        return UPLOAD_DIR + uniqueFilename;
    }

    private String getCurrentUserEmail(Authentication auth) {
        return auth.getName();
    }
}
