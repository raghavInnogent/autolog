package com.example.backend.serviceImpl;

import com.example.backend.dto.response.ScheduleResponseDTO;
import com.example.backend.entity.Document;
import com.example.backend.entity.ServicedItems;
import com.example.backend.repository.DocumentRepository;
import com.example.backend.repository.ServicedItemsRepository;
import com.example.backend.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleServiceImpl implements ScheduleService {
    @Autowired
    private  ServicedItemsRepository servicedItemsRepository;
    @Autowired
    private DocumentRepository documentRepository;

    @Override
    public List<ScheduleResponseDTO> getUpcomingSchedules(Long userId) {
        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysLater = today.plusDays(30);
        List<ScheduleResponseDTO> schedules = new ArrayList<>();

        // Fetch upcoming services (next 30 days)
//        List<ServicedItems> upcomingServices = servicedItemsRepository.findByExpirationDateBetween(today,
//                thirtyDaysLater);
//        for (ServicedItems item : upcomingServices) {
//            if (item.getServiceRecord() != null && item.getServiceRecord().getVehicle() != null &&
//                    item.getServiceRecord().getVehicle().getOwner().getId().equals(userId)) {
//
//                schedules.add(ScheduleResponseDTO.builder()
//                        .title(item.getServiceCategory().getName())
//                        .vehicleName(item.getServiceRecord().getVehicle().getModel())
//                        .dueDate(item.getExpirationDate())
//                        .type("SERVICE")
//                        .status("UPCOMING")
//                        .build());
//            }
//        }

        // Fetch expiring documents (next 30 days)
        List<Document> expiringDocs = documentRepository.findByExpirationDateBetween(today, thirtyDaysLater);
        for (Document doc : expiringDocs) {
            if (doc.getVehicle() != null && doc.getVehicle().getOwner().getId().equals(userId)) {
                schedules.add(ScheduleResponseDTO.builder()
                        .title(doc.getDocName())
                        .vehicleName(doc.getVehicle().getModel())
                        .dueDate(doc.getExpirationDate())
                        .type("DOCUMENT")
                        .status("UPCOMING")
                        .build());
            }
        }
        schedules.sort(Comparator.comparing(ScheduleResponseDTO::getDueDate));
        return schedules;
    }
}
