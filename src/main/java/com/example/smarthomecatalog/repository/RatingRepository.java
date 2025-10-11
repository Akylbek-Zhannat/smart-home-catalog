package com.example.smarthomecatalog.repository;

import com.example.smarthomecatalog.model.Rating;
import com.example.smarthomecatalog.model.Device;
import com.example.smarthomecatalog.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByUserAndDevice(User user, Device device);
    List<Rating> findByDevice(Device device);
}
