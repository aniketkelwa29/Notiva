package com.net.Notiva.entity;

import lombok.Data;
import org.springframework.stereotype.Component;

@Data
@Component
public class CurrentUser {
    String UserId;
    String Email;
    private Roles role;
}
