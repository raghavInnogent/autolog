package com.example.backend.serviceImpl;

import com.example.backend.dao.UserDao;
import com.example.backend.dao.VehicleDao;
import com.example.backend.dto.vehicle.VehicleRequestDTO;
import com.example.backend.dto.vehicle.VehicleResponseDTO;
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
    private UserDao userDao;

    public VehicleResponseDTO create(Long ownerId, VehicleRequestDTO dto) {
        User owner = userDao.findById(ownerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, MessageKey.USER_NOT_FOUND.name()));
        Vehicle v = VehicleMapper.toEntity(dto,new Vehicle());
        v.setOwner(owner);
        Vehicle saved = vehicleDao.save(v);
        return VehicleMapper.toResponse(saved);
    }

    public VehicleResponseDTO getById(Long id, Long userId) {
        Vehicle v = vehicleDao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, MessageKey.VEHICLE_NOT_FOUND.name()));
        if(!v.getOwner().getId().equals(userId)){
             throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }
        return VehicleMapper.toResponse(v);
    }

    public List<VehicleResponseDTO> getAll(Long userId) {
        return vehicleDao.findByOwnerId(userId).stream()
                .map(VehicleMapper::toResponse)
                .collect(Collectors.toList());
    }

    public VehicleResponseDTO update(Long id, Long userId, VehicleRequestDTO dto) {
        Vehicle v = vehicleDao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, MessageKey.VEHICLE_NOT_FOUND.name()));
        if(!v.getOwner().getId().equals(userId)){
             throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        v=VehicleMapper.toEntity(dto,v);
        Vehicle updated = vehicleDao.save(v);
        return VehicleMapper.toResponse(updated);
    }

    public void delete(Long id, Long userId) {
        Vehicle v = vehicleDao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, MessageKey.VEHICLE_NOT_FOUND.name()));
        if(!v.getOwner().getId().equals(userId)){
             throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }
        vehicleDao.delete(v);
    }
}
