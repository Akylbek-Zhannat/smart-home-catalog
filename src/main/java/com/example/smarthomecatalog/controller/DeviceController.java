package com.example.smarthomecatalog.controller;

import com.example.smarthomecatalog.model.Device;
import com.example.smarthomecatalog.repository.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    @Autowired
    private DeviceRepository deviceRepository;

    @GetMapping
    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    @GetMapping("/{id}")
    public Device getDeviceById(@PathVariable Long id) {
        Optional<Device> device = deviceRepository.findById(id);
        return device.orElse(null);
    }

    @PostMapping
    public Device addDevice(@RequestBody Device device) {
        return deviceRepository.save(device);
    }

    @PutMapping("/{id}")
    public Device updateDevice(@PathVariable Long id, @RequestBody Device updatedDevice) {
        return deviceRepository.findById(id).map(device -> {
            device.setName(updatedDevice.getName());
            device.setType(updatedDevice.getType());
            device.setPrice(updatedDevice.getPrice());
            device.setAddedDate(updatedDevice.getAddedDate());
            device.setDescription(updatedDevice.getDescription());
            return deviceRepository.save(device);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public String deleteDevice(@PathVariable Long id) {
        deviceRepository.deleteById(id);
        return "Device deleted with id " + id;
    }
}