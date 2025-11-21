package com.example.backend.security;

import java.security.Principal;

public class UserPrincipal implements Principal {
    private final Long id;
    private final String email;
    private final String role;

    public UserPrincipal(Long id, String email, String role) {
        this.id = id;
        this.email = email;
        this.role = role;
    }

    @Override
    public String getName() {
        return email;
    }

    public Long getId() {
        return id;
    }

    public String getRole() {
        return role;
    }
}
