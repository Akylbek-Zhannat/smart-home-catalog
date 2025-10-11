package com.example.smarthomecatalog.repository;

import com.example.smarthomecatalog.model.Comment;
import com.example.smarthomecatalog.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByDevice(Device device);
}
