package com.example.backend.service;

import com.example.backend.dto.request.UserRequestDTO;
import com.example.backend.dto.response.UserResponseDTO;

import java.util.List;

public interface UserService {
    public UserResponseDTO create(UserRequestDTO dto);
    public UserResponseDTO getById(Long id);
    public List<UserResponseDTO> getAll();
    public UserResponseDTO update(Long id, UserRequestDTO dto);
    public UserResponseDTO delete(Long id);
}
