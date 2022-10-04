package com.javacode.Spring.Security.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.javacode.Spring.Security.domain.model.Task;
import com.javacode.Spring.Security.repository.TaskRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {
	private final TaskRepo taskRepo;

	public Task insert(Task task) {
		return taskRepo.insert(task);
	}

	public List<Task> getTaskFromList(List<String> taskIds) {
		List<Task> tasks = new ArrayList<>();
		taskIds.forEach(id -> tasks.add(taskRepo.findById(id).get()));
		return tasks;
	}

	public Optional<Task> findById(String id) {
		return taskRepo.findById(id);
	}

	public void deleteAll(List<Task> entities) {
		taskRepo.deleteAll(entities);
	}
	
	public void delete(Task task) {
		taskRepo.delete(task);
	}
	
	public List<Task> findTaskByMembers(String member, String projectId) {
		 return taskRepo.findByMembers(member, projectId);
	}
	
	public Task save(Task task) {
		return taskRepo.save(task);
	}
	
	public List<Task> findTasksByProjectId(String projectId) {
		return taskRepo.findByProjectId(projectId);
	}

}
