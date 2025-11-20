package com.example.backend.service;

import com.example.backend.dao.UserDao;
import com.example.backend.dto.request.UserRequestDTO;
import com.example.backend.dto.response.UserResponseDTO;
import com.example.backend.dto.summary.VehicleSummaryDTO;
import com.example.backend.entity.User;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.stream.Collectors;
import java.util.List;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;

    // Create
    public UserResponseDTO create(UserRequestDTO dto) {

        if (userDao.existsByEmail(dto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setContactNo(dto.getContactNo());

        User saved = userDao.save(user);
        return convert(saved);
    }

    // Get by id
    public UserResponseDTO getById(Long id) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return convert(user);
    }

    // Get all
    public List<UserResponseDTO> getAll() {
        return userDao.findAll()
                .stream()
                .map(this::convert)
                .collect(Collectors.toList());
    }

    // Update
    public UserResponseDTO update(Long id, UserRequestDTO dto) {

        User user = userDao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setContactNo(dto.getContactNo());

        User updated = userDao.save(user);
        return convert(updated);
    }

    // Delete
    public UserResponseDTO delete(Long id) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        UserResponseDTO dto = convert(user);
        userDao.delete(user);
        return dto;
    }

    // Convert Entity -> DTO
    private UserResponseDTO convert(User user) {
        UserResponseDTO dto = new UserResponseDTO();

        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setContactNo(user.getContactNo());

        if (user.getVehicles() != null) {
            dto.setVehicles(
                    user.getVehicles().stream()
                            .map(v -> new VehicleSummaryDTO(
                                    v.getId(),
                                    v.getCompany(),
                                    v.getModel(),
                                    v.getVehicleNumber()
                            ))
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }
}
