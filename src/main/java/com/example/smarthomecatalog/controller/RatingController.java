package com.example.smarthomecatalog.controller;

import com.example.smarthomecatalog.model.Rating;
import com.example.smarthomecatalog.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @PostMapping("/items/{id}/rate")
    public Rating rateDevice(@PathVariable Long id,
                             @RequestParam int value,
                             Authentication auth) {
        return ratingService.rateDevice(id, auth.getName(), value);
    }

    @GetMapping("/items/{id}/rating")
    public double getAverageRating(@PathVariable Long id) {
        return ratingService.getAverageRating(id);
    }

    @GetMapping("/items/{id}/likes")
    public long getLikeCount(@PathVariable Long id) {
        return ratingService.getLikeCount(id);
    }
}
