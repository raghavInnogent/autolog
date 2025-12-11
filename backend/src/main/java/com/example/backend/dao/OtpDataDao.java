package com.example.backend.dao;

import com.example.backend.entity.OtpData;
import com.example.backend.repository.OtpDataRepositry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

@Repository
public class OtpDataDao
{
    @Autowired
    private OtpDataRepositry otpDataRepositry;

    public OtpData findByEmail(String email)
    {
        return otpDataRepositry.findById(email).orElse(null);
    }

    public OtpData save(OtpData otpData)
    {
        return otpDataRepositry.save(otpData);
    }

    public void delete(OtpData  otpData)
    {
        otpDataRepositry.delete(otpData);
    }



}
