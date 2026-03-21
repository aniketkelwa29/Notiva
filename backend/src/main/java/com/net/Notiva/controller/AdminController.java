package com.net.Notiva.controller;

import com.net.Notiva.entity.CurrentUser;
import com.net.Notiva.entity.User;
import com.net.Notiva.services.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @Autowired
    CurrentUser currentUser;


    private User user;

    @GetMapping("/getAllUsers")
    public ResponseEntity<List<User>> getAllUser() {
        List<User> allUsers = adminService.getAllUser();
        allUsers.add(adminService.getById(currentUser.getUserId()));
        if (allUsers.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(allUsers, HttpStatus.OK);
    }

    @DeleteMapping("/deleteAllUsers")
    public ResponseEntity<User>deleteAll(){
        adminService.deleteAll();
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
