package com.javacode.Spring.Security.domain.dto;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.javacode.Spring.Security.domain.model.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
	private String id;
	private Date createdAt;
	private Date modifiedAt;
	private String username;
	private Set<Role> authorities = new HashSet<>();
	private String fullName;
	private List<String> projects;
	private String jwt;
	private List<String> notifications;
	private String phoneNumber;
	private String address;
	private String email;
	private String school;
	private String gender;
}
