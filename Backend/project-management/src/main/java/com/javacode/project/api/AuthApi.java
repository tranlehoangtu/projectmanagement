package com.javacode.project.api;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.javacode.project.domain.model.User;
import com.javacode.project.domain.model.dto.AuthRequest;
import com.javacode.project.util.JwtTokenUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController 
@RequiredArgsConstructor
@Log4j2
@RequestMapping(path = "api/public")
@CrossOrigin
public class AuthApi {
	private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;

    @PostMapping("login")
    public ResponseEntity<User> login(@RequestBody AuthRequest request ) {
    	log.info("Username: {}", request.getUsername());
    	log.info("Password: {}", request.getPassword());
        try {
            Authentication authenticate = authenticationManager
                .authenticate(
                    new UsernamePasswordAuthenticationToken(
                        request.getUsername(), request.getPassword()
                    )
                );

            User user = (User) authenticate.getPrincipal();

            return ResponseEntity.ok()
                .header(
                    HttpHeaders.AUTHORIZATION,
                    jwtTokenUtil.generateToken(user)
                )
                .body(user);
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    
    @GetMapping("free")
    public String getString() {
    	return "it's Free";
    }
}
