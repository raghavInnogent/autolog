package com.example.backend.serviceImpl;

import com.example.backend.dao.ServiceCategoriesDao;
import com.example.backend.dao.ServiceRecordDao;
import com.example.backend.dto.request.ServiceRecordRequestDTO;
import com.example.backend.dto.response.ServiceRecordResponseDTO;
import com.example.backend.entity.ServiceCategories;
import com.example.backend.entity.ServiceRecord;
import com.example.backend.entity.Vehicle;
import com.example.backend.mapper.ServiceRecordMapper;
import com.example.backend.repository.ServiceCategoriesRepository;
import com.example.backend.repository.VehicleRepository;
import com.example.backend.service.ServiceRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceRecordServiceImpl implements ServiceRecordService {

    private final ServiceRecordDao dao;
    private final VehicleRepository vehicleRepo;
    private final ServiceCategoriesRepository categoryRepo;
    private final ServiceRecordMapper mapper;
    private final ServiceCategoriesDao  categoryDao;

    @Override
    public ServiceRecordResponseDTO create(ServiceRecordRequestDTO dto) {
        ServiceRecord record = mapper.toEntity(dto);

        Vehicle vehicle = vehicleRepo.findById(dto.getVehicleId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        String.format("Vehicle not found with id: %d", dto.getVehicleId())
                ));
        record.setVehicle(vehicle);

        record.getServicedItems().forEach(item-> {
            Period period =categoryDao.findById(item.getServiceCategoryId()).getExpiryInMonths();
            item.setExpirationDate(record.getDateOfService().plus(period));
        });

        ServiceRecord savedRecord = dao.save(record);
        return mapper.toResponseDTO(savedRecord);
    }




    @Override
    public ServiceRecordResponseDTO getById(Long id) {
        ServiceRecord record = dao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"ServiceRecord not found"));
        return mapper.toResponseDTO(record);
    }

    @Override
    public List<ServiceRecordResponseDTO> getAll() {
        return dao.findAll().stream()
                .map(mapper::toResponseDTO)
                .toList();
    }
}
