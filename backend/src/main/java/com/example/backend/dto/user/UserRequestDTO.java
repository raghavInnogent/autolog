package com.example.backend.dto.user;

import lombok.Data;

@Data
public class UserRequestDTO {

    private String name;

    private String email;

    private String password;

    private Long contactNo;
}
