package com.example.smarthomecatalog.repository;

import com.example.smarthomecatalog.model.UserHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserHistoryRepository extends JpaRepository<UserHistory, Long> {
    List<UserHistory> findByUsernameOrderByTimestampDesc(String username);
}
