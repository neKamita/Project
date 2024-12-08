package uz.pdp.project.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import uz.pdp.project.entity.Post;
import uz.pdp.project.service.PostService;

@Controller
@RequestMapping("/post")
public class PostController {
    private PostService postService;

    @PostMapping
    public String post(Post post) {
        postService.addPost(post);

        return "redirect:/";
    }
}
