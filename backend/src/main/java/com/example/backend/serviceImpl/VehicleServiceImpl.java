package com.example.backend.serviceImpl;

import com.example.backend.dao.UserDao;
import com.example.backend.dao.VehicleDao;
import com.example.backend.dto.request.VehicleRequestDTO;
import com.example.backend.dto.response.VehicleResponseDTO;
import com.example.backend.entity.User;
import com.example.backend.entity.Vehicle;
import com.example.backend.enums.MessageKey;
import com.example.backend.mapper.VehicleMapper;
import com.example.backend.service.VehicleService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class VehicleServiceImpl implements VehicleService {

    @Autowired
    private VehicleDao vehicleDao;

    @Autowired
    private VehicleMapper vehicleMapper;

    @Autowired
    private UserDao userDao;

    public VehicleResponseDTO create(Long ownerId, VehicleRequestDTO dto) {
        User owner = userDao.findById(ownerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, MessageKey.USER_NOT_FOUND.name()));
        Vehicle v = vehicleMapper.toEntity(dto);
        v.setOwner(owner);
        System.out.println(v);
        Vehicle saved = vehicleDao.save(v);
        System.out.println("after : " + saved);
        VehicleResponseDTO response = vehicleMapper.toResponseDTO(saved);
        System.out.println(response.getImage());
        return response;
    }

    public VehicleResponseDTO getById(Long id, Long userId) {
        Vehicle v = vehicleDao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, MessageKey.VEHICLE_NOT_FOUND.name()));
        if(!v.getOwner().getId().equals(userId)){
             throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }
        return vehicleMapper.toResponseDTO(v);
    }

    public List<VehicleResponseDTO> getAll(Long userId) {
        return vehicleDao.findByOwnerId(userId).stream()
                .map(vehicle ->  vehicleMapper.toResponseDTO(vehicle))
                .collect(Collectors.toList());
    }

    public VehicleResponseDTO update(Long id, Long userId, VehicleRequestDTO dto) {
        Vehicle v = vehicleDao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, MessageKey.VEHICLE_NOT_FOUND.name()));
        if(!v.getOwner().getId().equals(userId)){
             throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        v=vehicleMapper.toEntity(dto);
        Vehicle updated = vehicleDao.save(v);
        return vehicleMapper.toResponseDTO(updated);
    }

    public void delete(Long id, Long userId) {
        Vehicle v = vehicleDao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, MessageKey.VEHICLE_NOT_FOUND.name()));
        if(!v.getOwner().getId().equals(userId)){
             throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }
        vehicleDao.delete(v);
    }

    @Override
    public Vehicle findVehicleByRegistrationNo(String registrationNo) {
        return vehicleDao.findByRegistrationNumber(registrationNo).get();
    }
}
