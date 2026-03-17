package com.net.Notiva.controller;

import com.net.Notiva.dto.LoginRequest;
import com.net.Notiva.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    @GetMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){

        return ResponseEntity.ok(authService.login(request));
    }
}
