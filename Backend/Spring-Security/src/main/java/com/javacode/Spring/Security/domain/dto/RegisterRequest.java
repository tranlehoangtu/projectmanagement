package com.javacode.Spring.Security.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
	private String username;
	private String password;
	private String repassword;
	private String position;

}
