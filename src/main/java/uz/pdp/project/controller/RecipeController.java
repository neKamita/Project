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

    private static final String UPLOAD_DIR = "static/images/";

    private static final Logger logger = LoggerFactory.getLogger(RecipeController.class);

    @PostMapping("/add-recipe")
    public String addRecipe(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("ingredients") String ingredients,
            @RequestParam("steps") String steps,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "difficulty", required = false) Integer difficulty,
            @RequestParam(value = "calories", required = false) Integer calories,
            @RequestParam(value = "proteins", required = false) Double proteins,
            @RequestParam(value = "carbs", required = false) Double carbs,
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
            if (imagePath != null) {
                recipe.setImagePath(imagePath);
            }
            recipe.setUser(currentUser);
            recipe.setEnabled(true);

            // Добавление новых полей статистики
            recipe.setDifficulty(difficulty != null ? difficulty : 1);
            recipe.setCalories(calories != null ? calories : 0);
            recipe.setProteins(proteins != null ? proteins : 0.0);
            recipe.setCarbs(carbs != null ? carbs : 0.0);
            recipe.setLikes(0);
            recipe.setComments(0);
            recipe.setViews(0);

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
        return "recipes"; // Corrected return value
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
        // Use absolute path for image upload
        Path uploadPath = Paths.get(System.getProperty("user.dir"), "src", "main", "resources", UPLOAD_DIR)
                .toAbsolutePath().normalize();
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

        // Return the path relative to static resources
        return "/images/" + uniqueFilename;  // Add leading slash
    }

    private String getCurrentUserEmail(Authentication auth) {
        return auth.getName();
    }

    @GetMapping("/recipe/{id}")
    public String getRecipeById(@PathVariable Long id, Model model) {
        Recipe recipe = recipeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Recipe not found"));
        
        // Fix image path handling
        String imagePath = recipe.getImagePath();
        if (imagePath == null || imagePath.isEmpty()) {
            recipe.setImagePath("/images/default-recipe.jpg");
        } else if (!imagePath.startsWith("/")) {
            // Ensure image path starts with /
            recipe.setImagePath("/" + imagePath);
        }
        
        // Check if image file exists in both possible locations
        String relativePath = imagePath.startsWith("/") ? imagePath.substring(1) : imagePath;
        Path absolutePath = Paths.get(System.getProperty("user.dir"), "src", "main", "resources", "static", relativePath);
        
        if (!Files.exists(absolutePath)) {
            logger.warn("Image not found at: {}. Using default image.", absolutePath);
            recipe.setImagePath("/images/default-recipe.jpg");
        }

        model.addAttribute("recipe", recipe);
        return "recipe-details";
    }
}