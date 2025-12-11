package com.example.backend.repository;

import com.example.backend.entity.OtpData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface OtpDataRepositry extends JpaRepository<OtpData, String> {
}
