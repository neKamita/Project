package uz.pdp.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.pdp.project.entity.Post;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    public List<Post> findAllByUserId(Long userId);
}
