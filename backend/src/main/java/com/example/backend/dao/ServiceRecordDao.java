package com.example.backend.dao;

import com.example.backend.entity.ServiceRecord;
import com.example.backend.repository.ServiceRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ServiceRecordDao {

    private final ServiceRecordRepository repository;


    public ServiceRecord save(ServiceRecord record) {
        return repository.save(record);
    }

    public Optional<ServiceRecord> findById(Long id) {
        return repository.findById(id);
    }

    public List<ServiceRecord> findAll() {
        return repository.findAll();
    }
}
