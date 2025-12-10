package com.example.backend.dto.ocr;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRecordOCR_DTO {

    private String vehicleModel;
    private String vehicleCompany;
    private String vehicleNo;
    private Integer cost;
    private String dateOfService;
    private String workshop;
    private Integer mileage;
    private String invoice;
    private String type;

    private List<ServicedItemsOCR_DTO> servicedItems;

}
