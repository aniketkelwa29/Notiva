package com.net.Notiva.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.net.Notiva.entity.Roles;

import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "users")
public class User {
    @Id
    String id;
    @Indexed(unique = true)
    String userName;
    @Indexed(unique = true)
    String email;
    String password;
    private Roles role = Roles.USER;
    List<Note> notes = new ArrayList<>();
}
