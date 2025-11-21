package com.example.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
  private final Key key;
  public JwtUtil(@Value("${security.jwt.secret}") String secret){ this.key = Keys.hmacShaKeyFor(secret.getBytes()); }

  public String generateToken(String subjectEmail, Long userId, String role){
    long now = System.currentTimeMillis();
    return Jwts.builder()
      .setSubject(subjectEmail)
      .claim("uid", userId)
      .claim("role", role)
      .setIssuedAt(new Date(now))
      .setExpiration(new Date(now + 1000L*60*60*24))
      .signWith(key, SignatureAlgorithm.HS256).compact();
  }

  public Jws<Claims> parse(String token){ return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token); }
}