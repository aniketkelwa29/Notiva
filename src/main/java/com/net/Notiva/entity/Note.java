package com.net.Notiva.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "notes")
@Data
public class Note {
    @Id
    private String id;
    private String title;

    private String content;

    private String userId;

    private LocalDateTime currenttime =LocalDateTime.now();


}