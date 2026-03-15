package com.net.Notiva.config;

import com.net.Notiva.services.CustomerDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
  @Autowired
  private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private CustomerDetailsService customerDetailsService;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/user/register").permitAll()
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults())
                .userDetailsService(customerDetailsService);  // this one is the new method for the configure global



        return http.build();
            }
    // iss method se hum, jo username password db me h unse check kr rhe h postman k user or pass ko
    // we call userdetails service and pass the data of user and instance of password encoder

//    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
//        auth.userDetailsService(customerDetailsService).passwordEncoder(passwordEncoder);
//    }
}