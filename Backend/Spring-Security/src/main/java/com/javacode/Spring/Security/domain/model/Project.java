package com.javacode.Spring.Security.domain.model;

import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "projects")
public class Project {
	private String id;
	private String projectName;
	private String timespan;
	private Date dueDate;
	private String projectManager;
	private List<String> members;
	private List<String> tasks;
	private String leader;
	private String createBy;
	private String createAt;
	private String editAt;
}
