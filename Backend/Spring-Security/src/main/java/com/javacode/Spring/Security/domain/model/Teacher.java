package com.javacode.Spring.Security.domain.model;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "teachers")
public class Teacher {
	private String id;
	private String teacherId;
	private String teacherName;
	private String userId;
	private List<String> projects;
}
