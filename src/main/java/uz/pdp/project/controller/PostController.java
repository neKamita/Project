package uz.pdp.project.controller;

import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import uz.pdp.project.dto.PostDTO;
import uz.pdp.project.service.PostService;

@RestController
@RequestMapping("/post")
public class PostController {
    private PostService postService;

    @PostMapping
    public ResponseEntity<?> post(PostDTO postDTO) {
       return postService.addPost(postDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return postService.deletePost(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return postService.getPostById(id);
    }

}
