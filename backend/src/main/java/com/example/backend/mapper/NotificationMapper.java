package com.example.backend.mapper;

import com.example.backend.dto.response.NotificationDetailDTO;
import com.example.backend.dto.response.NotificationResponseDTO;
import com.example.backend.entity.Notification;
import com.example.backend.enums.NotificationPriority;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface NotificationMapper {

    NotificationResponseDTO toResponseDTO(Notification notification);

    NotificationDetailDTO toDetailDTO(Notification notification);

    Notification toEntity(NotificationResponseDTO dto);

    @org.mapstruct.AfterMapping
    default void calculateDaysLeft(@org.mapstruct.MappingTarget NotificationResponseDTO dto,
            Notification notification) {
        updateDaysAndPriority(notification, dto::setDaysLeft, dto::setPriority);
    }

    @org.mapstruct.AfterMapping
    default void calculateDaysLeftForDetail(@org.mapstruct.MappingTarget NotificationDetailDTO dto,
            Notification notification) {
        updateDaysAndPriority(notification, dto::setDaysLeft, dto::setPriority);
    }

    default void updateDaysAndPriority(Notification notification,
            java.util.function.Consumer<Integer> daysSetter,
            java.util.function.Consumer<NotificationPriority> prioritySetter) {
        if (notification.getExpiryDate() != null) {
            long daysApart = java.time.temporal.ChronoUnit.DAYS.between(java.time.LocalDate.now(),
                    notification.getExpiryDate());
            daysSetter.accept((int) daysApart);

            if (daysApart <= 1) {
                prioritySetter.accept(NotificationPriority.HIGH);
            } else if (daysApart <= 7) {
                prioritySetter.accept(NotificationPriority.MODERATE);
            } else {
                prioritySetter.accept(NotificationPriority.LOW);
            }
        }
    }
}