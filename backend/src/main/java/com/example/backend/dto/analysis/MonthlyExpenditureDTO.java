package com.example.backend.dto.analysis;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyExpenditureDTO {
    private Integer year;
    private List<Double> monthlyExpenditure;
    private Double totalExpenditure;
}
