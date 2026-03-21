package com.net.Notiva.services;

import com.net.Notiva.dto.LoginRequest;
import com.net.Notiva.jwtSecurity.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class  AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    public String login(LoginRequest request){
      Authentication authentication =
              authenticationManager.authenticate(
                      new UsernamePasswordAuthenticationToken(
                              request.getUserName()

                              ,request.getPassword()));
      String jwtToken = jwtUtil.generrateToken(request.getUserName());

          return jwtToken;
    }
}
