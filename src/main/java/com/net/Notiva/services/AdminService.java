package com.net.Notiva.services;

import com.net.Notiva.entity.Roles;
import com.net.Notiva.entity.User;
import com.net.Notiva.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {
    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUser() {
        return userRepository.findByRole(Roles.USER);
    }

    public User getById(String id) {
        Optional<User> user = userRepository.findById(id);
        return user!=null? user.get(): null;
    }
    public void deleteAll(){

        userRepository.deleteAll();
    }
}
