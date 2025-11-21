package com.example.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.Claims;
import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
  private final JwtUtil jwtUtil;
  public JwtAuthenticationFilter(JwtUtil jwtUtil){ this.jwtUtil = jwtUtil; }

  @Override
  protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
      throws ServletException, IOException {
    String auth = req.getHeader("Authorization");
    if(auth!=null && auth.startsWith("Bearer ")){
      String token = auth.substring(7);
      try{
        Claims claims = jwtUtil.parse(token).getBody();
        String email = claims.getSubject();
        Long uid = claims.get("uid", Long.class);
        String role = claims.get("role", String.class);
        
        UserPrincipal principal = new UserPrincipal(uid, email, role);
        
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(principal, null,
            role!=null ? List.of(new SimpleGrantedAuthority("ROLE_"+role)) : List.of());
        SecurityContextHolder.getContext().setAuthentication(authToken);
      }catch(Exception ignored){}
    }
    chain.doFilter(req, res);
  }
}