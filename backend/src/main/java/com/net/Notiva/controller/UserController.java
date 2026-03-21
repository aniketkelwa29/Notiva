package com.net.Notiva.controller;

import com.net.Notiva.entity.User;
import com.net.Notiva.jwtSecurity.JwtUtil;
import com.net.Notiva.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<User> getUser() {
        System.out.println("call from get ");
        return new ResponseEntity<>(userService.getUser(), HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<User> addUser(@RequestBody User userDetails) {
        return new ResponseEntity<>(userService.addUser(userDetails), HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<User> updateUser( @RequestBody User updatedDetails) {
        userService.updateUser(updatedDetails);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @DeleteMapping
    public ResponseEntity<Void> deleteuser() {
        userService.deleteUser();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
