package com.example.smarthomecatalog.service;

import com.example.smarthomecatalog.model.*;
import com.example.smarthomecatalog.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RatingService {

    @Autowired
    private RatingRepository ratingRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DeviceRepository deviceRepository;

    public Rating rateDevice(Long deviceId, String username, int value) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Rating rating = ratingRepository.findByUserAndDevice(user, device)
                .orElse(new Rating());
        rating.setUser(user);
        rating.setDevice(device);
        rating.setValue(value);

        return ratingRepository.save(rating);
    }

    public double getAverageRating(Long deviceId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found"));
        List<Rating> ratings = ratingRepository.findByDevice(device);
        return ratings.isEmpty() ? 0 : ratings.stream().mapToInt(Rating::getValue).average().orElse(0);
    }

    public long getLikeCount(Long deviceId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found"));
        return ratingRepository.findByDevice(device).stream().filter(r -> r.getValue() == 5).count();
    }
}
