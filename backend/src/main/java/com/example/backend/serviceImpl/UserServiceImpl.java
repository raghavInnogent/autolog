package com.example.backend.serviceImpl;

import com.example.backend.dao.UserDao;
import com.example.backend.dto.user.UserRequestDTO;
import com.example.backend.dto.user.UserResponseDTO;
import com.example.backend.dto.vehicle.VehicleSummaryDTO;
import com.example.backend.entity.User;
import com.example.backend.enums.MessageKey;
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

    public UserResponseDTO create(UserRequestDTO dto) {

        if (userDao.existsByEmail(dto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, com.example.backend.enums.MessageKey.EMAIL_ALREADY_EXISTS.name());
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(PasswordEncoderFactories.createDelegatingPasswordEncoder().encode(dto.getPassword()));
        user.setContactNo(dto.getContactNo());
        user.setRole(com.example.backend.enums.UserRole.USER);

        User saved = userDao.save(user);
        return convert(saved);
    }

    public UserResponseDTO getById(Long id) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, MessageKey.USER_NOT_FOUND.name()));
        return convert(user);
    }

    public List<UserResponseDTO> getAll() {
        return userDao.findAll()
                .stream()
                .map(this::convert)
                .collect(Collectors.toList());
    }

    // Update
    public UserResponseDTO update(Long id, UserRequestDTO dto) {

        User user = userDao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, MessageKey.USER_NOT_FOUND.name()));

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(PasswordEncoderFactories.createDelegatingPasswordEncoder().encode(dto.getPassword()));
        user.setContactNo(dto.getContactNo());

        User updated = userDao.save(user);
        return convert(updated);
    }

    public UserResponseDTO delete(Long id) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,MessageKey.USER_NOT_FOUND.name()));
        UserResponseDTO dto = convert(user);
        userDao.delete(user);
        return dto;


    }

    public void updatePassword(String email, String oldPassword, String newPassword) {
        User user = userDao.findByEmail(email);
        if (user == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, MessageKey.USER_NOT_FOUND.name());
        PasswordEncoder encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
        if (!encoder.matches(oldPassword, user.getPassword())) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, MessageKey.INVALID_CREDENTIALS.name());
        user.setPassword(encoder.encode(newPassword));
        userDao.save(user);
    }

    private UserResponseDTO convert(User user) {
        UserResponseDTO dto = UserMapper.toResponse(user);

        if (user.getVehicles() != null) {
            dto.setVehicles(
                    user.getVehicles().stream()
                            .map(v -> new VehicleSummaryDTO(
                                    v.getId(),
                                    v.getCompany(),
                                    v.getModel(),
                                    v.getRegistrationNumber()
                            ))
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }
}
