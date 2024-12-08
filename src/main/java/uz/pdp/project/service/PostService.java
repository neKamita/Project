package uz.pdp.project.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import uz.pdp.project.entity.Post;

@Service
@RequiredArgsConstructor
public class PostService {


    public void addPost(Post post) {
        SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}


