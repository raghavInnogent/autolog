package com.example.backend.dto.request;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class ServiceRecordRequestDTO {

    private Long vehicleId;

    private Integer cost;

    private LocalDate dateOfService;

    private String workshop;

    private Integer mileage;

    private String invoice;

    private String type;

    private List<ServicedItemRequestDTO> servicedItems;

    @Override
    public String toString() {
        return "ServiceRecordRequestDTO{" +
                "vehicleId=" + vehicleId +
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
