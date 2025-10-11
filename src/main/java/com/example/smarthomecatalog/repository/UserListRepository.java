package com.example.smarthomecatalog.repository;

import com.example.smarthomecatalog.model.UserList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserListRepository extends JpaRepository<UserList, Long> {
    List<UserList> findByUserId(Long userId);
}
