package com.example.backend.dto.response;


import com.example.backend.entity.Vehicle;
import lombok.Data;

import java.time.LocalDate;

@Data
public class OcrResponse 
{
	private Vehicle vehicle;

	private Integer cost;

	private LocalDate dateOfService;

	private String workshop;

	private Integer mileage;

	private String invoice;

	private String type;


}
