package com.javacode.Spring.Security.api;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.security.RolesAllowed;

import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.javacode.Spring.Security.domain.dto.CreateProject;
import com.javacode.Spring.Security.domain.dto.RemoveProject;
import com.javacode.Spring.Security.domain.dto.UpdateProjectMembers;
import com.javacode.Spring.Security.domain.model.Notification;
import com.javacode.Spring.Security.domain.model.Project;
import com.javacode.Spring.Security.domain.model.Role;
import com.javacode.Spring.Security.domain.model.User;
import com.javacode.Spring.Security.service.NotificationService;
import com.javacode.Spring.Security.service.ProjectService;
import com.javacode.Spring.Security.service.TaskService;
import com.javacode.Spring.Security.service.UserService;

import lombok.RequiredArgsConstructor;

@CrossOrigin
@RequiredArgsConstructor
@RestController
@RequestMapping("api")
public class ProjectApi {
	private final ProjectService projectService;
	private final TaskService taskService;
	private final UserService userService;
	private final NotificationService notificationService;

	@RolesAllowed({ Role.STUDENT, Role.MANAGEMENT })
	@GetMapping("project/{id}")
	public ResponseEntity<Project> getProject(@PathVariable(name = "id") String id) {
		return projectService.findById(id).map(project -> ResponseEntity.ok().body(project))
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@RolesAllowed({ Role.STUDENT, Role.MANAGEMENT })
	@PutMapping("project")
	public ResponseEntity<User> updateProject(@RequestParam("members") String isMember,
			@RequestBody UpdateProjectMembers data) {
		String projectId = data.getProjectId();
		List<String> members = data.getMembers();
		Project project = projectService.findById(projectId).get();

		switch (isMember) {
		case "remove": {
			members.forEach(member -> {
				User user = userService.findById((String) member).get();
				user.setProjects(getUniqueValues(user.getProjects(), List.of(projectId)));

				userService.save(user);

				project.setMembers(getUniqueValues(project.getMembers(), List.of(member)));

				taskService.findTaskByMembers(member, projectId).forEach(task -> {
					taskService.delete(task);
					project.setTasks(getUniqueValues(project.getTasks(), List.of(task.getId())));

				});
				projectService.save(project);
			});

			return ResponseEntity.ok().body(null);
		}
		case "add": {

			Notification notification = new Notification();
			notification.setName("Cập nhật dự án");
			notification.setContent("Bạn được thêm vào dự án " + project.getProjectName());

			User user = userService.findById((String) members.get(0)).get();
			user.getProjects().add(projectId);
			user.getNotifications().add(notificationService.insert(notification).getId());
			userService.save(user);

			project.getMembers().add(user.getId());
			projectService.save(project);

			return ResponseEntity.ok().body(user);
		}
		default:
			throw new IllegalArgumentException("Unexpected value: " + isMember);
		}
	}

	@RolesAllowed({ Role.MANAGEMENT })
	@PostMapping("project")
	public ResponseEntity<Project> insertProject(@RequestBody CreateProject createProject) {
		Project project = new Project();
		BeanUtils.copyProperties(createProject, project);

		String userId = createProject.getUserid();
		User user = userService.findById(userId).get();

		project = projectService.insert(project);
		user.getProjects().add(project.getId());
		userService.save(user);

		return ResponseEntity.ok().body(project);
	}

	@RolesAllowed({ Role.MANAGEMENT })
	@PutMapping("project/update")
	public ResponseEntity<Project> updateProject(@RequestBody Project project) {
		Project nProject = projectService.findById(project.getId()).get();

		nProject.setEditAt(new Date().toString());
		nProject.setProjectName(project.getProjectName());
		nProject.setDueDate(project.getDueDate());

		return ResponseEntity.ok().body(projectService.save(nProject));
	}

	@RolesAllowed({ Role.MANAGEMENT })
	@PutMapping("project/upgrade")
	public ResponseEntity<Project> upgradeProject(@RequestBody Project project) {

		Project nProject = projectService.findById(project.getId()).get();
		nProject.setLeader(project.getLeader());

		User leader = userService.findById(nProject.getLeader()).get();
		User projectManager = userService.findById(nProject.getProjectManager()).get();

		Notification notification = new Notification();
		notification.setName("Thăng cấp");
		notification.setContent("Bạn đã được bổ nhiệm làm trưởng nhóm " + nProject.getProjectName() + " bởi "
				+ projectManager.getFullName());

		leader.getNotifications().add(notificationService.insert(notification).getId());
		userService.save(leader);

		return ResponseEntity.ok().body(projectService.save(nProject));
	}

	@RolesAllowed({ Role.MANAGEMENT })
	@DeleteMapping("project")
	public ResponseEntity<Project> deleteProject(@RequestBody RemoveProject removeProject) {

		String id = removeProject.getId();
		String userId = removeProject.getUserId();

		Project project = projectService.findById(id).get();

		project.getMembers().forEach(member -> {
			User tempUser = userService.findById(member).get();
			tempUser.setProjects(getUniqueValues(tempUser.getProjects(), List.of(id)));

			userService.save(tempUser);
		});

		project.getTasks().forEach(task -> {
			taskService.delete(taskService.findById(task).get());
		});

		projectService.delete(project);

		User user = userService.findById(userId).get();
		user.setProjects(getUniqueValues(user.getProjects(), List.of(id)));

		userService.save(user);

		return ResponseEntity.ok(null);
	}

	private List<String> getUniqueValues(List<String> firstList, List<String> secondList) {
		return firstList.stream().filter(item -> !secondList.contains(item)).collect(Collectors.toList());
	}
}