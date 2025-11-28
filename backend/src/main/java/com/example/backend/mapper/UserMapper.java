package com.example.backend.mapper;

import com.example.backend.dto.request.UserRequestDTO;
import com.example.backend.dto.response.UserResponseDTO;
import com.example.backend.entity.User;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        uses = {
                VehicleMapper.class
        }
)
public interface UserMapper {

    UserResponseDTO toResponseDTO(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    User toEntity(UserRequestDTO dto);
}