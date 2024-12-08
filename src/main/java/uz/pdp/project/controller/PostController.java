package uz.pdp.project.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.pdp.project.dto.PostDTO;
import uz.pdp.project.service.PostService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/post")
public class PostController {
    private final PostService postService;

    @PostMapping
    public ResponseEntity<?> post(PostDTO postDTO) {
       return postService.addPost(postDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        return postService.deletePost(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        return postService.getPostById(id);
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
       return postService.getPost();
    }

}
