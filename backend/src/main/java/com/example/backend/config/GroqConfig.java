package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class GroqConfig {

    @Bean
    public WebClient groqClient() {
        return WebClient.builder()
                .baseUrl("https://api.groq.com/openai/v1")
                .build();
    }
}
