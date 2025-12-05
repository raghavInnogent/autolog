package com.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationCountDTO {

    private Long unreadCount;
    private Long activeCount;
    private Long highPriorityCount;
    private Long moderatePriorityCount;
    private Long lowPriorityCount;
}