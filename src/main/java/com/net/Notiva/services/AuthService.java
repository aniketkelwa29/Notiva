package com.net.Notiva.services;

import com.net.Notiva.dto.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class  AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    public String login(LoginRequest request){
      Authentication authentication =
              authenticationManager.authenticate(
                      new UsernamePasswordAuthenticationToken(
                              request.getUsername()
                              ,request.getPassword()));
          return "Login Successful";
    }
}
