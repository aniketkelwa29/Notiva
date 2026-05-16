package com.net.Notiva.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Data
@Document(collection = "reminders")
public class Reminder {

    @Id
    private String id;

    private String title;

    private String message;
    @JsonFormat(
            pattern = "yyyy-MM-dd'T'HH:mm:ss"
    )

    private LocalDateTime reminderTime ;

    private boolean notified;

    private ReminderStatus status;


    // getters setters
}