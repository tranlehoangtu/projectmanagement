package com.javacode.Spring.Security.domain.model;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "students")
public class Student {
	private String id;
	private String studentId;
	private String studentName;
	private String studentGrade;
	private String studentClass;
	private String userId;
	private List<String> projects;
}
