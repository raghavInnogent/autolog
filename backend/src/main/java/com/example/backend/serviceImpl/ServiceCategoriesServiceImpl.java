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
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ServiceCategoriesServiceImpl implements ServiceCategoriesService {

    @Autowired
    ServiceCategoriesMapper serviceCategoriesMapper;

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
}