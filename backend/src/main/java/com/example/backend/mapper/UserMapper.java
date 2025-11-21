package com.example.backend.mapper;

import com.example.backend.dto.user.UserResponseDTO;
import com.example.backend.entity.User;

public class UserMapper {
    public static UserResponseDTO toResponse(User u){
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(u.getId());
        dto.setName(u.getName());
        dto.setEmail(u.getEmail());
        dto.setContactNo(u.getContactNo());
        return dto;
    }
}