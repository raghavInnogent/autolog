package com.example.backend.mapper;

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

    @Mapping(source = "vehicles", target = "vehicles")
    UserResponseDTO toResponseDTO(User user);
}
