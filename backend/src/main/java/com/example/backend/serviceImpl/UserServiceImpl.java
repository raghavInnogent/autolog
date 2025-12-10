package com.example.backend.serviceImpl;

import com.example.backend.dao.UserDao;
import com.example.backend.dto.request.UserRequestDTO;
import com.example.backend.dto.response.UserResponseDTO;
import com.example.backend.entity.User;
import com.example.backend.enums.MessageKey;
import com.example.backend.enums.UserRole;
import com.example.backend.mapper.UserMapper;
import com.example.backend.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.stream.Collectors;
import java.util.List;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private com.example.backend.dao.VehicleDao vehicleDao;

    public com.example.backend.dto.response.UserResponseDTO create(UserRequestDTO dto) {

        if (userDao.existsByEmail(dto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, MessageKey.EMAIL_ALREADY_EXISTS.name());
        }

        User user = userMapper.toEntity(dto);
        user.setPassword(PasswordEncoderFactories.createDelegatingPasswordEncoder().encode(dto.getPassword()));
        if (dto.getRole() == null)
            user.setRole(com.example.backend.enums.UserRole.USER);
        else
            user.setRole(com.example.backend.enums.UserRole.ADMIN);
        user.setStatus("ACTIVE");
        User saved = userDao.save(user);
        return userMapper.toResponseDTO(saved);
    }

    public UserResponseDTO getById(Long id) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, MessageKey.USER_NOT_FOUND.name()));
        UserResponseDTO dto = userMapper.toResponseDTO(user);
        dto.setTotalVehicleCount(vehicleDao.findByOwnerId(user.getId()).size());
        return dto;
    }

    public List<UserResponseDTO> getAll() {
        return userDao.findAll()
                .stream()
                .map(user -> {
                    UserResponseDTO dto = userMapper.toResponseDTO(user);
                    dto.setTotalVehicleCount(vehicleDao.findByOwnerId(user.getId()).size());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public UserResponseDTO update(Long id, UserRequestDTO dto) {

        User user = userDao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, MessageKey.USER_NOT_FOUND.name()));

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(PasswordEncoderFactories.createDelegatingPasswordEncoder().encode(dto.getPassword()));
        user.setContactNo(dto.getContactNo());

        User updated = userDao.save(user);
        return userMapper.toResponseDTO(updated);
    }

    public UserResponseDTO delete(Long id) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, MessageKey.USER_NOT_FOUND.name()));
        UserResponseDTO dto = userMapper.toResponseDTO(user);
        userDao.delete(user);
        return dto;

    }

    @Override
    public void updatePassword(String email, String oldPassword, String newPassword) {
        User user = userDao.findByEmail(email);
        if (user == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, MessageKey.USER_NOT_FOUND.name());
        PasswordEncoder encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
        if (!encoder.matches(oldPassword, user.getPassword()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, MessageKey.INVALID_CREDENTIALS.name());
        user.setPassword(encoder.encode(newPassword));
        userDao.save(user);
    }

    @Override
    public UserResponseDTO updateStatus(Long id, String status) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, MessageKey.USER_NOT_FOUND.name()));
        user.setStatus(status);
        return userMapper.toResponseDTO(userDao.save(user));
    }

    @Override
    public List<UserResponseDTO> getAllByRole(UserRole role) {
        return userDao.findAllByRole(role)
                .stream()
                .map(user -> {
                    UserResponseDTO dto = userMapper.toResponseDTO(user);
                    dto.setTotalVehicleCount(vehicleDao.findByOwnerId(user.getId()).size());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
