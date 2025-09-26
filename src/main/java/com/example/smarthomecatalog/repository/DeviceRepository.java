package com.example.smarthomecatalog.repository;

import com.example.smarthomecatalog.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
}