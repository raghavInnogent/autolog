package com.example.backend.dto.user;

import lombok.Data;

@Data
public class PasswordUpdateRequestDTO {
    private String oldPassword;
    private String newPassword;
}
