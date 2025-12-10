package com.example.backend.serviceImpl;

import com.example.backend.dao.ServiceCategoriesDao;
import com.example.backend.dto.request.ServiceCategoriesRequestDTO;
import com.example.backend.dto.response.ServiceCategoriesResponseDTO;
import com.example.backend.entity.ServiceCategories;
import com.example.backend.enums.MessageKey;
import com.example.backend.mapper.ServiceCategoriesMapper;
import com.example.backend.service.ServiceCategoriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Period;
import java.util.List;

@Service
public class ServiceCategoriesServiceImpl implements ServiceCategoriesService {

    @Autowired
    ServiceCategoriesMapper serviceCategoriesMapper;

    @Autowired
    GroqService groq;

    @Autowired
    ServiceCategoriesDao  serviceCategoriesDao;

    @Override
    public ServiceCategoriesResponseDTO addCategory(ServiceCategoriesRequestDTO dto) {

        if(serviceCategoriesDao.existsByName(dto.getName()))
        {
            throw new ResponseStatusException(HttpStatus.CONFLICT, MessageKey.CATEGORY_ALREADY_EXISTS.name());
        }

            ServiceCategories serviceCategories = serviceCategoriesMapper.toEntity(dto);
            ServiceCategories saved = serviceCategoriesDao.save(serviceCategories);
            return serviceCategoriesMapper.toResponseDTO(saved);

    }

    @Override
    public List<ServiceCategoriesResponseDTO> getAll() {

        return serviceCategoriesDao.findAll().stream()
                .map(serviceCategoriesMapper::toResponseDTO)
                .toList();
    }

    @Override
    public ResponseEntity<ServiceCategoriesResponseDTO> updateCategory(Long id, ServiceCategoriesRequestDTO dto) {
        ServiceCategories newServiceCategories = serviceCategoriesDao.findById(id);
        newServiceCategories.setName(dto.getName());
        newServiceCategories.setDescription(dto.getDescription());
        newServiceCategories.setExpiryInMonths(Period.ofMonths(dto.getExpiryInMonths()));
        return ResponseEntity.ok(serviceCategoriesMapper.toResponseDTO(serviceCategoriesDao.save(newServiceCategories)));
    }

    @Override
    public void deleteCategory(Long id) {
        serviceCategoriesDao.deleteById(id);
    }

    @Override
    public ServiceCategories findById(Long categoryId) {
        return serviceCategoriesDao.findById(categoryId);
    }



    @Override
    public ServiceCategoriesResponseDTO addNewServiceCategory(ServiceCategoriesRequestDTO  dto)
    {
        try {
            if (serviceCategoriesDao.existsByName(dto.getName())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, MessageKey.CATEGORY_ALREADY_EXISTS.name());
            }

            String prompt = String.format("""
                    Given the automotive part or service item name below, 
                    return ONLY the typical replacement interval in months as a single integer number. 
                    If the item is a service/labor/washing or doesn't have a replacement interval, return 0. 
                    No explanations, no text, just the number.
                    Item: %s
                    """, dto.getName());


            Integer expiry = Integer.parseInt(groq.askGroq(prompt).block());
            System.out.println("expiry : " + expiry);
            dto.setExpiryInMonths(expiry);

            ServiceCategories serviceCategories = serviceCategoriesMapper.toEntity(dto);
            ServiceCategories saved = serviceCategoriesDao.save(serviceCategories);
            return serviceCategoriesMapper.toResponseDTO(saved);
        }
        catch (Exception e)
        {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "INVALID CATEGORY");
        }
    }
}