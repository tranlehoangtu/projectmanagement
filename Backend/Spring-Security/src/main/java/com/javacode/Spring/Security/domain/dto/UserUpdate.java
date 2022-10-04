package com.javacode.Spring.Security.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdate {
	private String username;
	private String fullName;
	private String phoneNumber;
	private String address;
	private String email;
	private String school;
	private String gender;

}
