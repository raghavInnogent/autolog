package com.example.backend.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {
	

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(length = 1000)
	private String docImage;

    @ManyToOne
    private Vehicle vehicle;
	
	private String docName;
	
	private LocalDate expirationDate;
	
}
