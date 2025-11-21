package com.example.backend.service;

import com.example.backend.dao.UserDao;
import com.example.backend.dto.user.UserResponseDTO;
import com.example.backend.entity.User;
import com.example.backend.enums.MessageKey;
import com.example.backend.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;



@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserDao userDao;

    public UserResponseDTO login(String email, String password) {
        User user = userDao.findByEmail(email);
        if(user == null){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, MessageKey.INVALID_CREDENTIALS.name());
        }
        PasswordEncoder encoder = org.springframework.security.crypto.factory.PasswordEncoderFactories.createDelegatingPasswordEncoder();
        if(!encoder.matches(password, user.getPassword())){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, MessageKey.INVALID_CREDENTIALS.name());
        }
        return UserMapper.toResponse(user);
    }

    public void logout() {
        // Stateless logout (client discards token)
    }

    public UserResponseDTO getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if(auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, MessageKey.UNAUTHORIZED.name());
        }
        User user = userDao.findByEmail(auth.getName());
        if(user == null){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, MessageKey.UNAUTHORIZED.name());
        }
        return UserMapper.toResponse(user);
    }
}