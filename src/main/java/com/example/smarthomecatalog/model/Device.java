package com.example.smarthomecatalog.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;
    private double price;
    private LocalDate addedDate;
    @Column(length = 1000)
    private String description;
    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;
    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }
    public Device() {}

    public Device(String name, String type, double price, LocalDate addedDate, String description) {
        this.name = name;
        this.type = type;
        this.price = price;
        this.addedDate = addedDate;
        this.description = description;
    }

    // Геттеры и сеттеры
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public LocalDate getAddedDate() { return addedDate; }
    public void setAddedDate(LocalDate addedDate) { this.addedDate = addedDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}