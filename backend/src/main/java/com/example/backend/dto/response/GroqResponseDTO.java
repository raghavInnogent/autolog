package com.example.backend.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class GroqResponseDTO {
    private String id;
    private String object;
    private long created;
    private String model;
    private List<Choice> choices;
    private Usage usage;

    @Data
    public static class Choice {
        private int index;
        private Message message;
        private String finish_reason;
    }

    @Data
    public static class Message {
        private String role;
        private String content;
    }

    @Data
    public static class Usage {
        private double queue_time;
        private int prompt_tokens;
        private double prompt_time;
        private int completion_tokens;
        private double completion_time;
        private int total_tokens;
        private double total_time;
    }
}
