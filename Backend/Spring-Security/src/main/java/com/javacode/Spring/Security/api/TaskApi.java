package com.javacode.Spring.Security.api;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.security.RolesAllowed;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.javacode.Spring.Security.domain.model.Project;
import com.javacode.Spring.Security.domain.model.Role;
import com.javacode.Spring.Security.domain.model.Task;
import com.javacode.Spring.Security.service.ProjectService;
import com.javacode.Spring.Security.service.TaskService;

import lombok.RequiredArgsConstructor;

@CrossOrigin
@RequestMapping("api")
@RequiredArgsConstructor
@RestController
public class TaskApi {
	private final TaskService taskService;
	private final ProjectService projectService;
	
	@RolesAllowed({Role.STUDENT, Role.MANAGEMENT})
	@PostMapping("task")
	public ResponseEntity<Task> insertTask(@RequestBody Task task) {
		Project project = projectService.findById(task.getProjectId()).get();
		Task retTask = taskService.insert(task);

		project.getTasks().add(retTask.getId());
		projectService.save(project);
		
		return ResponseEntity.ok().body(retTask);
	}
	
	@RolesAllowed({Role.STUDENT, Role.MANAGEMENT})
	@DeleteMapping("tasks/delete")
	public ResponseEntity<Project> deleteTasks(@RequestBody Map<String, Object> list) {
		String projectId = (String) list.get("projectId");
		List<?> taskIds = (List<?>) list.get("taskIds");

		List<Task> tasks = taskIds.stream().map(taskId -> taskService.findById((String) taskId).get()).collect(Collectors.toList());
		tasks.forEach(task -> System.out.println(task.toString()));
		taskService.deleteAll(tasks);
		
		Project project = projectService.findById(projectId).get();
		project.setTasks(getUniqueValues(project.getTasks(), taskIds));
		
		Project nProject = projectService.save(project);
		System.out.println(nProject.toString());
		
		return ResponseEntity.ok().body(nProject);
	}
	
	@RolesAllowed({Role.STUDENT, Role.MANAGEMENT})
	@GetMapping("task/{id}")
	public ResponseEntity<Task> getTask(@PathVariable("id") String id) {
		return ResponseEntity.ok().body(taskService.findById(id).get());
	}
	
	@RolesAllowed({Role.STUDENT, Role.MANAGEMENT})
	@PutMapping("task/update")
	public ResponseEntity<Task> updateTask(@RequestBody Map<String, String> object) {
		String id = object.get("id");
		Task task = taskService.findById(id).get();
		switch (object.get("type")) {
		case "contents": {
			task.setContents(object.get("contents"));
			return ResponseEntity.ok().body(taskService.save(task));
		}
		default:
			throw new IllegalArgumentException("Unexpected value: " + object.get("type"));
		}
	}
	
	private List<String> getUniqueValues(List<String> firstList, List<?> secondList) {
		return firstList.stream().filter(item -> !secondList.contains(item)).collect(Collectors.toList());
	}
}
