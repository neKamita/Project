package uz.pdp.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.pdp.project.entity.Category;

import java.util.Optional;

@Repository
public interface CategoryRepository  extends JpaRepository<Category, Integer> {
    Optional<Category> findByName(String name);
}
