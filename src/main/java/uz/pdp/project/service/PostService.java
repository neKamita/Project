package uz.pdp.project.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import uz.pdp.project.dto.PostDTO;
import uz.pdp.project.dto.ResponseMessage;
import uz.pdp.project.entity.Post;
import uz.pdp.project.entity.User;
import uz.pdp.project.repository.PostRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;

    public ResponseEntity<?> addPost(PostDTO postDTO) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Post post = Post
                .builder()
                .title(postDTO.getTitle())
                .content(postDTO.getContent())
                .category(postDTO.getCategory())
                .createdAt(LocalDateTime.now())
                .author(user)
                .build();

        postRepository.save(post);

        return ResponseEntity.status(HttpStatus.CREATED).body(new ResponseMessage(true,"created",post));
    }

    public ResponseEntity<?> deletePost(Long postId) {
        Optional<Post> byId = postRepository.findById(postId);
        if (byId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage(false,"not found",null));
        }
        Post post = byId.get();
        postRepository.delete(post);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(new ResponseMessage(true,"deleted",post));
    }

    public ResponseEntity<?> getPostById(Long postId) {
        Optional<Post> byId = postRepository.findById(postId);
        if (byId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage(false,"not found",null));
        }
        return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(true,"found",byId));
    }

    public ResponseEntity<?> getPost(PostDTO postDTO) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Post> allByUserId = postRepository.findAllByUserId(user.getId());
        if (allByUserId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage(false,"not found",null));
        }

        return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(true,"found",allByUserId));
    }


}


