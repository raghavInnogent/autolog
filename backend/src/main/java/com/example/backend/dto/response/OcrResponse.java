package com.example.backend.dto.response;


import lombok.Data;

@Data
public class OcrResponse 
{
    private String name;
    private String vehicleModel;
    private String vehicleNumber;
    private String odometer;
    private String purchaseDate;
    private String nextService;
    private String rawText;    // optional full OCR output
	public OcrResponse(String string) {
		System.out.println(string);
	}
	@Override
	public String toString() {
		return "OcrResponse [name=" + name + ", vehicleModel=" + vehicleModel + ", vehicleNumber=" + vehicleNumber
				+ ", odometer=" + odometer + ", purchaseDate=" + purchaseDate + ", nextService=" + nextService
				+ ", rawText=" + rawText + "]";
	}
    
}
