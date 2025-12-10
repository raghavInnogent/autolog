package com.example.backend.repository;

import com.example.backend.dto.response.UserResponseDTO;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);

    User findByEmailAndPassword(String email, String password);

    User findByEmail(String email);

    java.util.List<User> findByRole(com.example.backend.enums.UserRole role);
}
