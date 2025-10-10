package com.example.smarthomecatalog.repository;

import com.example.smarthomecatalog.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DeviceRepository extends JpaRepository<Device, Long> {
    List<Device> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);
    List<Device> findByRating(Double rating);

    // поиск по тегу (tags — ElementCollection)
    @Query("select d from Device d join d.tags t where lower(t) = lower(:tag)")
    List<Device> findByTagIgnoreCase(@Param("tag") String tag);
}
