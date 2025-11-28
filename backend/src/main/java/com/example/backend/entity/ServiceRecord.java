package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class ServiceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Vehicle vehicle;

    private Integer cost;

    private LocalDate dateOfService;

    private String workshop;

    private Integer mileage;

    private String invoice;

    private String type;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<ServicedItems> servicedItems;

    @Override
    public String toString() {
        return "ServiceRecord{" +
                "id=" + id +
                ", vehicle=" + vehicle +
                ", cost=" + cost +
                ", dateOfService=" + dateOfService +
                ", workshop='" + workshop + '\'' +
                ", mileage=" + mileage +
                ", invoice='" + invoice + '\'' +
                ", type='" + type + '\'' +
                ", servicedItems=" + servicedItems +
                '}';
    }
}