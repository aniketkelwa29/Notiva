package com.net.Notiva.controller;

import com.net.Notiva.dto.LoginRequest;
import com.net.Notiva.entity.User;
import com.net.Notiva.jwtSecurity.JwtUtil;
import com.net.Notiva.services.AuthService;
import com.net.Notiva.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private AuthService authService;
    @Autowired
    BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private UserService userService;
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){


       // return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            User user = userService.getByUserName(request.getUsername());
                if(passwordEncoder.matches(request.getPassword(),user.getPassword())){
                String bearerToken =    jwtUtil.generrateToken(request.getUsername());
                    return ResponseEntity.ok(Map.of("token",bearerToken));
                }
       return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/login")

    public String loginA(){
  return "called";

        }

    }

