package com.example.backend.serviceImpl;

import com.example.backend.dao.UserDao;
import com.example.backend.dto.response.UserResponseDTO;
import com.example.backend.entity.User;
import com.example.backend.enums.MessageKey;
import com.example.backend.mapper.UserMapper;
import com.example.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.security.UserPrincipal;


@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserMapper userMapper;

    public UserResponseDTO login(String email, String password) {
        User user = userDao.findByEmail(email);
        if(user == null){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, MessageKey.INVALID_CREDENTIALS.name());
        }
        PasswordEncoder encoder = org.springframework.security.crypto.factory.PasswordEncoderFactories.createDelegatingPasswordEncoder();
        if(!encoder.matches(password, user.getPassword())){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, MessageKey.INVALID_CREDENTIALS.name());
        }
        return userMapper.toResponseDTO(user);
    }

    public void logout() {
    }

    public UserResponseDTO getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if(auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, MessageKey.UNAUTHORIZED.name());
        }
        
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        User user = userDao.findById(principal.getId()).orElse(null);
        
        if(user == null){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, MessageKey.UNAUTHORIZED.name());
        }
        return userMapper.toResponseDTO(user);
    }
}
