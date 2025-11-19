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

    private String itemName;

    private String itemDescription;

    private Integer itemPrice;

    private Period itemQuantity;

}
