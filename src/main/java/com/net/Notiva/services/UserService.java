package com.net.Notiva.services;

import com.net.Notiva.entity.User;
import com.net.Notiva.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public User getUser(String userId) {
        return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User addUser(User userDetails) {
        String encodedPassword = passwordEncoder.encode(userDetails.getPassword());
        userDetails.setPassword(encodedPassword);

        return userRepository.save(userDetails);

    }

    public User updateUser(String userId, User updatedDetails) {
        User existingUser = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        existingUser.setUserName(updatedDetails.getUserName());
        if(updatedDetails.getPassword()!=null){
        existingUser.setPassword(passwordEncoder.encode(updatedDetails.getPassword()));}
        existingUser.setEmail(updatedDetails.getEmail());
        existingUser.setRole(updatedDetails.getRole());

        return userRepository.save(existingUser);
    }

    public User deleteUser(String userId) {

        User existingUser = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
//        userRepository.delete(existingUser);
        userRepository.deleteById(userId);

        return existingUser;
    }

}