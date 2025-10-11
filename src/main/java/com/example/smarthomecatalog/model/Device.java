package com.example.smarthomecatalog.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "devices")
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;
    private Double price;

    @Column(columnDefinition = "text")
    private String description;

    private Double rating;

    @ElementCollection
    @CollectionTable(name = "device_tags", joinColumns = @JoinColumn(name = "device_id"))
    @Column(name = "tag")
    private List<String> tags;
    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();

    private String imageUrl;

    private Boolean isPublic = true;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;

    public Device() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }

    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }
}
