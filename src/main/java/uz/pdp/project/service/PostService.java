package uz.pdp.project.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import uz.pdp.project.dto.PostDTO;
import uz.pdp.project.dto.ResponseMessage;
import uz.pdp.project.entity.Category;
import uz.pdp.project.entity.Post;
import uz.pdp.project.entity.User;
import uz.pdp.project.repository.CategoryRepository;
import uz.pdp.project.repository.PostRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;

    public ResponseEntity<?> addPost(PostDTO postDTO) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<Category> byName = categoryRepository.findByName(postDTO.getCategory());
        if (byName.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseMessage(false,"category is null",null));
        }
        Post post = Post
                .builder()
                .title(postDTO.getTitle())
                .content(postDTO.getContent())
                .category(byName.get())
                .createdAt(LocalDateTime.now())
                .author(user)
                .build();

        postRepository.save(post);

        return ResponseEntity.status(HttpStatus.CREATED).body(new ResponseMessage(true,"created",post));
    }

    public ResponseEntity<?> deletePost(Integer postId) {
        Optional<Post> byId = postRepository.findById(postId);
        if (byId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage(false,"not found",null));
        }
        Post post = byId.get();
        postRepository.delete(post);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(new ResponseMessage(true,"deleted",post));
    }

    public ResponseEntity<?> getPostById(Integer postId) {
        Optional<Post> byId = postRepository.findById(postId);
        if (byId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage(false,"not found",null));
        }
        return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(true,"found",byId));
    }

    public ResponseEntity<?> getPost() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<List<Post>> allByAuthorId = postRepository.findAllByAuthorId(user.getId());
        if (allByAuthorId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage(false,"not found",null));
        }
        return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(true,"found",allByAuthorId.get()));
    }


}


