package uz.pdp.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.project.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);
}
