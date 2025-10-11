package com.example.smarthomecatalog.service;

import com.example.smarthomecatalog.model.*;
import com.example.smarthomecatalog.repository.CommentRepository;
import com.example.smarthomecatalog.repository.DeviceRepository;
import com.example.smarthomecatalog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private UserRepository userRepository;

    public Comment addComment(Long deviceId, String username, String text) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setText(text);
        comment.setAuthor(user);
        comment.setDevice(device);
        return commentRepository.save(comment);
    }

    public List<Comment> getComments(Long deviceId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found"));
        return commentRepository.findByDevice(device);
    }

    public void deleteComment(Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        if (!comment.getAuthor().getUsername().equals(username)) {
            throw new RuntimeException("You can delete only your own comments");
        }
        commentRepository.delete(comment);
    }
}
