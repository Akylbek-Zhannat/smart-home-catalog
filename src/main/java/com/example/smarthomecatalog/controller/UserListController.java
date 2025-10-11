package com.example.smarthomecatalog.controller;

import com.example.smarthomecatalog.model.Device;
import com.example.smarthomecatalog.model.User;
import com.example.smarthomecatalog.model.UserList;
import com.example.smarthomecatalog.repository.DeviceRepository;
import com.example.smarthomecatalog.repository.UserListRepository;
import com.example.smarthomecatalog.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
public class UserListController {

    private final UserRepository userRepository;
    private final UserListRepository listRepository;
    private final DeviceRepository deviceRepository;

    public UserListController(UserRepository userRepository,
                              UserListRepository listRepository,
                              DeviceRepository deviceRepository) {
        this.userRepository = userRepository;
        this.listRepository = listRepository;
        this.deviceRepository = deviceRepository;
    }

    @PostMapping("/users/{id}/lists")
    public ResponseEntity<?> createList(@PathVariable Long id, @RequestBody UserList newList) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

        newList.setUser(userOpt.get());
        return ResponseEntity.ok(listRepository.save(newList));
    }

    @PostMapping("/lists/{listId}/items")
    public ResponseEntity<?> addItemToList(@PathVariable Long listId, @RequestParam Long deviceId) {
        Optional<UserList> listOpt = listRepository.findById(listId);
        Optional<Device> deviceOpt = deviceRepository.findById(deviceId);
        if (listOpt.isEmpty() || deviceOpt.isEmpty()) return ResponseEntity.notFound().build();

        UserList list = listOpt.get();
        list.getDevices().add(deviceOpt.get());
        listRepository.save(list);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/lists/{listId}")
    public ResponseEntity<?> getList(@PathVariable Long listId) {
        Optional<UserList> list = listRepository.findById(listId);
        return list.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
