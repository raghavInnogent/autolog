package com.example.backend.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.backend.entity.Notification;
import com.example.backend.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class NotificationDao {
	@Autowired
    private  NotificationRepository repository;

    public Notification save(Notification notification) {
        return repository.save(notification);
    }

    public List<Notification> findByUserId(Long userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Optional<Notification> findById(Long id) {
        return repository.findById(id);
    }
}
