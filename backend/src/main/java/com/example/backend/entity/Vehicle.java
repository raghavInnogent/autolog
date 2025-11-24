    package com.example.backend.entity;


    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    import java.time.LocalDate;
    import java.util.List;

    @Entity
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class Vehicle {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne(fetch = FetchType.LAZY)
        private User owner;

        private String registrationNumber;

        private String model;

        private String company;

        @jakarta.persistence.Column(columnDefinition = "TEXT")
        private String description;

        private String type;

        @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
        private List<Document> documents;

        @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
        private List<ServiceRecord> servicings;

        private LocalDate purchaseDate;

        @Column(columnDefinition = "TEXT")
        private String image;

        @Override
        public String toString() {
            return "Vehicle{" +
                    "id=" + id +
                    ", owner=" + owner +
                    ", registrationNumber='" + registrationNumber + '\'' +
                    ", model='" + model + '\'' +
                    ", company='" + company + '\'' +
                    ", description='" + description + '\'' +
                    ", type='" + type + '\'' +
                    ", documents=" + documents +
                    ", servicings=" + servicings +
                    ", purchaseDate=" + purchaseDate +
                    ", image='" + image + '\'' +
                    '}';
        }
    }
