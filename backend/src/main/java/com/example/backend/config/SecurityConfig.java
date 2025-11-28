package com.example.backend.config;

import com.example.backend.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
  @Bean 
  PasswordEncoder passwordEncoder()
  { return PasswordEncoderFactories.createDelegatingPasswordEncoder(); }

  @Bean 
  SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter) throws Exception {
    http.csrf(csrf->csrf.disable())
        .cors(Customizer.withDefaults())
        .sessionManagement(sm->sm.sessionCreationPolicy(org.springframework.security.config.http.SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth->auth
            .requestMatchers("/auth/**", "/users/create").permitAll()
                .requestMatchers("/vehicles/**").authenticated()
                .requestMatchers("/categories/**").authenticated()
                .requestMatchers("/servicing/**").authenticated()
                .requestMatchers("/documents/**").authenticated()
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }

  @Bean 
  AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception 
  {
    return cfg.getAuthenticationManager();
  }
}