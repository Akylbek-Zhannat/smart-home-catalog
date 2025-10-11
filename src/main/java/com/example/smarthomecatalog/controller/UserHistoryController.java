package com.example.smarthomecatalog.controller;

import com.example.smarthomecatalog.model.UserHistory;
import com.example.smarthomecatalog.repository.UserHistoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserHistoryController {
    private final UserHistoryRepository historyRepository;

    public UserHistoryController(UserHistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    @GetMapping("/{username}/history")
    public List<UserHistory> getUserHistory(@PathVariable String username) {
        return historyRepository.findByUsernameOrderByTimestampDesc(username);
    }
}
