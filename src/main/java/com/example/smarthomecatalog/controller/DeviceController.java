package com.example.smarthomecatalog.controller;

import com.example.smarthomecatalog.model.Device;
import com.example.smarthomecatalog.model.User;
import com.example.smarthomecatalog.repository.DeviceRepository;
import com.example.smarthomecatalog.repository.UserRepository;
import com.example.smarthomecatalog.security.JwtUtil;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {


        @Autowired
        private DeviceRepository deviceRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private JwtUtil jwtUtil;

        @GetMapping
        public List<Device> getAllDevices() {
            return deviceRepository.findAll();
        }

        @GetMapping("/{id}")
        public Device getDeviceById(@PathVariable Long id) {
            return deviceRepository.findById(id).orElse(null);
        }

        @PostMapping
        public Device addDevice(@RequestBody Device device, @RequestHeader("Authorization") String authHeader) {
            String token = authHeader.replace("Bearer ", ""); // или "Zhannat " если используешь свой префикс
            String username = jwtUtil.extractUsername(token);
            User author = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
            device.setAuthor(author);
            return deviceRepository.save(device);
        }

        @PutMapping("/{id}")
        public Device updateDevice(@PathVariable Long id, @RequestBody Device updatedDevice,
                                   @RequestHeader("Authorization") String authHeader) {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtUtil.extractUsername(token);
            return deviceRepository.findById(id).map(device -> {
                if (!device.getAuthor().getUsername().equals(username)) {
                    throw new RuntimeException("You are not the author of this device");
                }
                device.setName(updatedDevice.getName());
                device.setType(updatedDevice.getType());
                device.setPrice(updatedDevice.getPrice());
                device.setAddedDate(updatedDevice.getAddedDate());
                device.setDescription(updatedDevice.getDescription());
                return deviceRepository.save(device);
            }).orElseThrow(() -> new RuntimeException("Device not found"));
        }

        @DeleteMapping("/{id}")
        public String deleteDevice(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
            Device device = deviceRepository.findById(id).orElseThrow(() -> new RuntimeException("Device not found"));
            String username = jwtUtil.extractUsername(authHeader.replace("Bearer ", ""));
            if (!device.getAuthor().getUsername().equals(username)) {
                throw new RuntimeException("You are not the author of this device");
            }
            deviceRepository.delete(device);
            return "Deleted";
        }
    }


