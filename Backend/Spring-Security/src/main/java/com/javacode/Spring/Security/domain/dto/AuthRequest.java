package com.javacode.Spring.Security.domain.dto;

import lombok.Getter;

@Getter
public class AuthRequest {
	private String username;
	private String password;
}
