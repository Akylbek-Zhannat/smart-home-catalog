package com.example.smarthomecatalog.controller;

import com.example.smarthomecatalog.model.Comment;
import com.example.smarthomecatalog.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/items/{id}/comments")
    public Comment addComment(@PathVariable Long id,
                              @RequestBody String text,
                              Authentication auth) {
        return commentService.addComment(id, auth.getName(), text);
    }

    @GetMapping("/items/{id}/comments")
    public List<Comment> getComments(@PathVariable Long id) {
        return commentService.getComments(id);
    }

    @DeleteMapping("/comments/{id}")
    public void deleteComment(@PathVariable Long id, Authentication auth) {
        commentService.deleteComment(id, auth.getName());
    }
}
