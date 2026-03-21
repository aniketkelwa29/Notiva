package com.net.Notiva.jwtSecurity;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

   private final Key secretkey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
   // private String secretkey = "notiva-key-generation-process-for-security-purpose";

    public String generrateToken(String userName) {


        return Jwts.builder()
                .setSubject(userName)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000*60*60*24*5))
                .signWith(SignatureAlgorithm.HS256, secretkey)
                .compact();

    }
    public String extractUserName(String token) {

        return Jwts.parser()
                .setSigningKey(secretkey)
                .parseClaimsJws(token)
                .getBody().getSubject();
    }

    public boolean validateToken(String token, UserDetails userDetails) {

        String userName = extractUserName(token);

        return userName.equals(userDetails.getUsername());
    }
}
