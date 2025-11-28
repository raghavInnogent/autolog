package com.example.backend.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Period;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class ServiceCategories {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    private String description;

    private Integer price;

    @Column(columnDefinition = "TEXT")
    private String image;

    private Period expiryInMonths;


    @Override
    public String toString() {
        return "ServiceCategories{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", price=" + price +
                ", image='" + image + '\'' +
                ", expiryInMonths=" + expiryInMonths +
                '}';
    }
}
