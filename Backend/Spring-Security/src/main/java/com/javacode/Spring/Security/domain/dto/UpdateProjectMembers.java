package com.javacode.Spring.Security.domain.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProjectMembers {
	private String projectId;
	private List<String> members;
}
