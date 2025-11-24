package com.example.backend.dto.request;

import lombok.Data;

@Data
public class PasswordUpdateRequestDTO {
    private String oldPassword;
    private String newPassword;
}
