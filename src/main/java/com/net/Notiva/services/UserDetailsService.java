package com.net.Notiva.services;

import com.net.Notiva.entity.User;
import com.net.Notiva.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;


public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user =   userRepository.findByUserName(username);
     if(user!=null){
         UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                 .username(user.getUserName()).
                 password(user.getPassword())
                         .roles(user.getRole().name()).
                 build();
         return userDetails;
     }
        throw new UsernameNotFoundException("userName not found "+username);
    }
}
