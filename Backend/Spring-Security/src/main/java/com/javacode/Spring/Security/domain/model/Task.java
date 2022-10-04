package com.javacode.Spring.Security.domain.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tasks")
public class Task {
	private String id;
	private String name;
	private String contents;
	private List<String> members = new ArrayList<>();;
	private List<String> comments = new ArrayList<>();
	private String timespan;
	private Date dueDate;
	private String status;
	private String projectId;
	private String createBy;
	private Date createAt;
	private Date editAt;
}
