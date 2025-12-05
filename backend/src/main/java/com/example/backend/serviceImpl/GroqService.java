package com.example.backend.serviceImpl;

import com.example.backend.dto.request.GroqRequestDTO;
import com.example.backend.dto.response.GroqResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Service
public class GroqService {

    @Value("${groq.api.key}")
    private String apiKey;

    private final WebClient client;

    public GroqService(WebClient.Builder builder) {
        this.client = builder
                .baseUrl("https://api.groq.com/openai/v1")
                .build();
    }

    public Mono<String> askGroq(String prompt) {

        List<GroqRequestDTO.Message> messages = new ArrayList<>();
        messages.add(new GroqRequestDTO.Message("user", prompt));

        GroqRequestDTO body = new GroqRequestDTO(
                "llama-3.1-8b-instant",
                messages
        );

        return client.post()
                .uri("/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(GroqResponseDTO.class)
                .map(res -> res.getChoices().get(0).getMessage().getContent())
                .doOnError(Throwable::printStackTrace);

    }
}
