package com.example.backend.controller;

import com.example.backend.serviceImpl.GroqService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/groq")
public class GroqController {

    private final GroqService groqService;

    public GroqController(GroqService groqService) {
        this.groqService = groqService;
    }

    @GetMapping("/ask")
    public Mono<String> ask(@RequestParam String q) {
        return groqService.askGroq(q);
    }
}
