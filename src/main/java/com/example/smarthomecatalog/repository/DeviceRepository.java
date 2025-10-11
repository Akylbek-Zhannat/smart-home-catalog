package com.example.smarthomecatalog.repository;

import com.example.smarthomecatalog.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DeviceRepository extends JpaRepository<Device, Long> {
    List<Device> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);
    List<Device> findByRating(Double rating);
    @Query("select d from Device d join d.tags t where lower(t) = lower(:tag)")
    List<Device> findByTagIgnoreCase(@Param("tag") String tag);

    @Query("SELECT d FROM Device d " +
            "WHERE (:tag IS NULL OR :tag MEMBER OF d.tags) " +
            "AND (:minRating IS NULL OR d.rating >= :minRating) " +
            "ORDER BY " +
            "CASE WHEN :sort = 'rating' THEN d.rating END DESC, " +
            "CASE WHEN :sort = 'date' THEN d.createdAt END DESC, " +
            "CASE WHEN :sort = 'name' THEN d.name END ASC")
    List<Device> findFiltered(String tag, Double minRating, String sort);
    @Query("SELECT DISTINCT d FROM Device d LEFT JOIN d.tags t " +
            "WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(d.description) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(t) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Device> searchDevices(String query);

}
