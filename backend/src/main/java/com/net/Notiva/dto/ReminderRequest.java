package com.net.Notiva.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Data
public class ReminderRequest {
    private String title;
    private String message;
    private LocalDateTime reminderTime ;

}
