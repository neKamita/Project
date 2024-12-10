package uz.pdp.project.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import uz.pdp.project.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE LOWER(u.email) = LOWER(:email)")
    boolean existsByEmail(@Param("email") String email);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE LOWER(u.username) = LOWER(:username)")
    boolean existsByUsername(
            @Param("username") @NotBlank(message = "Username is required") @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters") String username);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByUsernameIgnoreCase(String username);

    @Query("SELECT u FROM User u WHERE LOWER(u.email) = LOWER(:email)")
    Optional<User> findByEmailIgnoreCase(@Param("email") String email);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    @Query("SELECT COUNT(p) FROM Post p WHERE p.author.id = :userId")
    int countPostsByUserId(@Param("userId") Integer userId);

    @Query("SELECT COUNT(f) FROM Follower f WHERE f.userId = :userId")
    int countFollowersByUserId(@Param("userId") Integer userId);

    @Query("SELECT COUNT(f) FROM Follower f WHERE f.followerId = :userId")
    int countFollowingByUserId(@Param("userId") Integer userId);
}
