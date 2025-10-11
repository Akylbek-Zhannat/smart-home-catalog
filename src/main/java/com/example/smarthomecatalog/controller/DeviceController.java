//package com.example.smarthomecatalog.controller;
//
//import com.example.smarthomecatalog.model.Device;
//import com.example.smarthomecatalog.model.User;
//import com.example.smarthomecatalog.repository.DeviceRepository;
//import com.example.smarthomecatalog.repository.UserRepository;
//import com.example.smarthomecatalog.security.JwtUtil;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.*;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.util.StringUtils;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.*;
//import java.nio.file.*;
//import java.util.*;
//import java.util.stream.Collectors;
//
//@RestController
//@RequestMapping("/api/devices")
//public class DeviceController {
//
//    @Autowired
//    private DeviceRepository deviceRepository;
//    @Autowired
//    private UserRepository userRepository;
//    @Autowired
//    private JwtUtil jwtUtil;
//
//    private final Path uploadDir = Paths.get("uploads");
//    private final long MAX_FILE_SIZE = 5L * 1024L * 1024L; // 5 MB
//    private final Set<String> ALLOWED_EXT = Set.of("jpg", "jpeg", "png", "pdf");
//
//    public DeviceController() throws IOException {
//        if (!Files.exists(uploadDir)) Files.createDirectories(uploadDir);
//    }
//    @GetMapping
//    public ResponseEntity<List<Device>> list(
//            @RequestParam(required = false) String search,
//            @RequestParam(required = false) Double rating,
//            @RequestParam(required = false) String tag
//    ) {
//        List<Device> devices = deviceRepository.findAll();
//
//        if (search != null && !search.isBlank()) {
//            String s = search.toLowerCase();
//            devices = devices.stream()
//                    .filter(d -> (d.getName() != null && d.getName().toLowerCase().contains(s))
//                            || (d.getDescription() != null && d.getDescription().toLowerCase().contains(s)))
//                    .collect(Collectors.toList());
//        }
//
//        if (rating != null) {
//            devices = devices.stream()
//                    .filter(d -> d.getRating() != null && Objects.equals(d.getRating(), rating))
//                    .collect(Collectors.toList());
//        }
//
//        if (tag != null && !tag.isBlank()) {
//            devices = deviceRepository.findByTagIgnoreCase(tag);
//        }
//        String currentUsername = getCurrentUsernameOrNull();
//        devices = devices.stream()
//                .filter(d -> {
//                    if (Boolean.TRUE.equals(d.getIsPublic())) return true;
//                    if (currentUsername == null) return false;
//                    return d.getAuthor() != null && currentUsername.equals(d.getAuthor().getUsername());
//                })
//                .collect(Collectors.toList());
//
//        return ResponseEntity.ok(devices);
//    }
//
//    @PostMapping("/upload")
//    public ResponseEntity<?> uploadDevice(
//            @RequestParam("file") MultipartFile file,
//            @RequestParam("name") String name,
//            @RequestParam(required = false) String type,
//            @RequestParam(required = false) Double price,
//            @RequestParam(required = false) String description,
//            @RequestParam(required = false) Double rating,
//            @RequestParam(required = false) String tags, // csv
//            @RequestParam(required = false) Boolean isPublic
//    ) {
//        String username = getCurrentUsernameOrNull();
//        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
//        if (file == null || file.isEmpty()) return ResponseEntity.badRequest().body(Map.of("message", "File required"));
//        if (file.getSize() > MAX_FILE_SIZE) return ResponseEntity.badRequest().body(Map.of("message", "File too large (max 5MB)"));
//        String orig = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
//        String ext = "";
//        int dot = orig.lastIndexOf('.');
//        if (dot >= 0) ext = orig.substring(dot + 1).toLowerCase();
//        if (!ALLOWED_EXT.contains(ext)) return ResponseEntity.badRequest().body(Map.of("message", "Invalid file type"));
//
//        try {
//            String storedName = System.currentTimeMillis() + "_" + UUID.randomUUID() + "_" + orig;
//            Path target = uploadDir.resolve(storedName);
//            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
//
//            Device device = new Device();
//            device.setName(name);
//            device.setType(type);
//            device.setPrice(price);
//            device.setDescription(description);
//            device.setRating(rating);
//            if (tags != null && !tags.isBlank()) {
//                List<String> tagList = Arrays.stream(tags.split(","))
//                        .map(String::trim)
//                        .filter(s -> !s.isEmpty())
//                        .collect(Collectors.toList());
//                device.setTags(tagList);
//            }
//            device.setImageUrl("/files/" + storedName);
//            device.setIsPublic(isPublic == null ? true : isPublic);
//
//            User author = userRepository.findByUsername(username).orElse(null);
//            if (author == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not found"));
//            device.setAuthor(author);
//
//            Device saved = deviceRepository.save(device);
//            return ResponseEntity.ok(saved);
//        } catch (IOException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "File save error"));
//        }
//    }
//    @PostMapping
//    public ResponseEntity<?> createJson(@RequestBody Device device) {
//        String username = getCurrentUsernameOrNull();
//        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        User author = userRepository.findByUsername(username).orElse(null);
//        if (author == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        device.setAuthor(author);
//        if (device.getIsPublic() == null) device.setIsPublic(true);
//        Device saved = deviceRepository.save(device);
//        return ResponseEntity.ok(saved);
//    }
//
//    private String getCurrentUsernameOrNull() {
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        if (auth == null) return null;
//        if (!auth.isAuthenticated()) return null;
//        Object principal = auth.getPrincipal();
//        if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
//            return ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
//        } else if (principal instanceof String) {
//            return (String) principal;
//        }
//        return null;
//    }
//    @GetMapping("/filter")
//    public ResponseEntity<List<Device>> filterDevices(
//            @RequestParam(required = false) String tag,
//            @RequestParam(required = false) Double minRating,
//            @RequestParam(required = false, defaultValue = "date") String sort
//    ) {
//        return ResponseEntity.ok(deviceRepository.findFiltered(tag, minRating, sort));
//    }
//    @GetMapping("/search")
//    public ResponseEntity<List<Device>> searchDevices(@RequestParam String query) {
//        return ResponseEntity.ok(deviceRepository.searchDevices(query));
//    }
//
//}

package com.example.smarthomecatalog.controller;

import com.example.smarthomecatalog.model.Device;
import com.example.smarthomecatalog.model.User;
import com.example.smarthomecatalog.model.UserHistory;
import com.example.smarthomecatalog.repository.DeviceRepository;
import com.example.smarthomecatalog.repository.UserRepository;
import com.example.smarthomecatalog.repository.UserHistoryRepository;
import com.example.smarthomecatalog.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    @Autowired
    private DeviceRepository deviceRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserHistoryRepository historyRepository;
    @Autowired
    private JwtUtil jwtUtil;

    private final Path uploadDir = Paths.get("uploads");
    private final long MAX_FILE_SIZE = 5L * 1024L * 1024L;
    private final Set<String> ALLOWED_EXT = Set.of("jpg", "jpeg", "png", "pdf");

    public DeviceController() throws IOException {
        if (!Files.exists(uploadDir)) Files.createDirectories(uploadDir);
    }

    //  Фильтр и Поиск
    @GetMapping
    public ResponseEntity<List<Device>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Double rating,
            @RequestParam(required = false) String tag
    ) {
        List<Device> devices = deviceRepository.findAll();

        if (search != null && !search.isBlank()) {
            String s = search.toLowerCase();
            devices = devices.stream()
                    .filter(d -> (d.getName() != null && d.getName().toLowerCase().contains(s))
                            || (d.getDescription() != null && d.getDescription().toLowerCase().contains(s)))
                    .collect(Collectors.toList());
        }

        if (rating != null) {
            devices = devices.stream()
                    .filter(d -> d.getRating() != null && Objects.equals(d.getRating(), rating))
                    .collect(Collectors.toList());
        }

        if (tag != null && !tag.isBlank()) {
            devices = deviceRepository.findByTagIgnoreCase(tag);
        }

        String currentUsername = getCurrentUsernameOrNull();
        devices = devices.stream()
                .filter(d -> {
                    if (Boolean.TRUE.equals(d.getIsPublic())) return true;
                    if (currentUsername == null) return false;
                    return d.getAuthor() != null && currentUsername.equals(d.getAuthor().getUsername());
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(devices);
    }

    //  Загрузка файла и создание устройства
    @PostMapping("/upload")
    public ResponseEntity<?> uploadDevice(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Double price,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Double rating,
            @RequestParam(required = false) String tags,
            @RequestParam(required = false) Boolean isPublic
    ) {
        String username = getCurrentUsernameOrNull();
        if (username == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        if (file == null || file.isEmpty())
            return ResponseEntity.badRequest().body(Map.of("message", "File required"));
        if (file.getSize() > MAX_FILE_SIZE)
            return ResponseEntity.badRequest().body(Map.of("message", "File too large (max 5MB)"));

        String orig = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String ext = orig.substring(orig.lastIndexOf('.') + 1).toLowerCase();
        if (!ALLOWED_EXT.contains(ext))
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid file type"));

        try {
            String storedName = System.currentTimeMillis() + "_" + UUID.randomUUID() + "_" + orig;
            Path target = uploadDir.resolve(storedName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            Device device = new Device();
            device.setName(name);
            device.setType(type);
            device.setPrice(price);
            device.setDescription(description);
            device.setRating(rating);
            if (tags != null && !tags.isBlank()) {
                device.setTags(Arrays.stream(tags.split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .collect(Collectors.toList()));
            }
            device.setImageUrl("/files/" + storedName);
            device.setIsPublic(isPublic == null ? true : isPublic);

            User author = userRepository.findByUsername(username).orElse(null);
            if (author == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not found"));
            device.setAuthor(author);

            Device saved = deviceRepository.save(device);

            UserHistory history = new UserHistory();
            history.setUsername(username);
            history.setAction("Uploaded device");
            history.setDetails("Device: " + name);
            historyRepository.save(history);

            return ResponseEntity.ok(saved);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "File save error"));
        }
    }

    @PostMapping
    public ResponseEntity<?> createJson(@RequestBody Device device) {
        String username = getCurrentUsernameOrNull();
        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        User author = userRepository.findByUsername(username).orElse(null);
        if (author == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        device.setAuthor(author);
        if (device.getIsPublic() == null) device.setIsPublic(true);
        Device saved = deviceRepository.save(device);

        UserHistory history = new UserHistory();
        history.setUsername(username);
        history.setAction("Created device");
        history.setDetails("Device: " + device.getName());
        historyRepository.save(history);

        return ResponseEntity.ok(saved);
    }

    private String getCurrentUsernameOrNull() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return null;
        Object principal = auth.getPrincipal();
        if (principal instanceof org.springframework.security.core.userdetails.UserDetails userDetails)
            return userDetails.getUsername();
        if (principal instanceof String) return (String) principal;
        return null;
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Device>> filterDevices(
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false, defaultValue = "date") String sort
    ) {
        return ResponseEntity.ok(deviceRepository.findFiltered(tag, minRating, sort));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Device>> searchDevices(@RequestParam String query) {
        return ResponseEntity.ok(deviceRepository.searchDevices(query));
    }
}
