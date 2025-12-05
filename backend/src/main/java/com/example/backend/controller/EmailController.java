package com.example.backend.controller;

import com.example.backend.serviceImpl.EmailServiceImpl;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
public class EmailController {

    private final EmailServiceImpl emailService;

    public EmailController(EmailServiceImpl emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/send")
    public String sendEmail(@RequestParam String to,
                            @RequestParam String subject,
                            @RequestParam String body) {

        emailService.sendSimpleEmail(to, subject, body);

        return "Email sent successfully!";
    }
}
