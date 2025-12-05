package com.example.backend.event;

import com.example.backend.entity.ServiceRecord;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class ServiceRecordCreatedEvent extends ApplicationEvent {

    private final ServiceRecord serviceRecord;

    public ServiceRecordCreatedEvent(Object source, ServiceRecord serviceRecord) {
        super(source);
        this.serviceRecord = serviceRecord;
    }
}