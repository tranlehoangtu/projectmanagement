package com.javacode.Spring.Security.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.javacode.Spring.Security.domain.model.Role;
import com.javacode.Spring.Security.domain.model.User;
import com.javacode.Spring.Security.repository.UserRepo;

import lombok.RequiredArgsConstructor;

@Service @RequiredArgsConstructor
public class UserService {

	private final UserRepo userRepo;
	private final PasswordEncoder passwordEncoder;

	public User insertUser(User user) {
		String password = user.getPassword();
		user.setPassword(passwordEncoder.encode(password));

		return userRepo.insert(user);
	}
	
	public Optional<User> findById(String id) {
		return userRepo.findById(id);
	}
	
	public User update(User user) {
		return userRepo.save(user);
	}
	
	public List<User> findByUsernameContaining (String username) {
		return userRepo.findByUsernameContaining(username);
	}
	
	public List<User> findByUsernameContainingAndAuthority(String username, Role role) {
		return userRepo.findByUsernameContainingAndAuthority(username, role);
	}
	
	public User save(User user) {
		return userRepo.save(user);
	}

	public Optional<User> findByUsername(String username) {
		return userRepo.findByUsername(username);
	}

	
}
