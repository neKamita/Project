package uz.pdp.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.project.entity.Recipe;

import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByEnabledTrue();
}
