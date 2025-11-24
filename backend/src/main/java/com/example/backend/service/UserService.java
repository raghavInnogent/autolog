package com.example.backend.service;

import com.example.backend.dto.request.UserRequestDTO;
import com.example.backend.dto.response.UserResponseDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
    public UserResponseDTO create(UserRequestDTO dto);
    public UserResponseDTO getById(Long id);
    public List<UserResponseDTO> getAll();
    public UserResponseDTO update(Long id, UserRequestDTO dto);
    public UserResponseDTO delete(Long id);
    public void updatePassword(String email, String oldPassword, String newPassword);
}
