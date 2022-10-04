package com.javacode.Spring.Security.api;

import javax.annotation.security.RolesAllowed;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.javacode.Spring.Security.domain.model.Role;
import com.javacode.Spring.Security.domain.model.Teacher;
import com.javacode.Spring.Security.service.TeacherService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api")
@RequiredArgsConstructor
@CrossOrigin
public class TeacherApi {

	private final TeacherService teacherService;
	
	@RolesAllowed({Role.STUDENT, Role.MANAGEMENT})
	@GetMapping("teacher/{id}")
	public ResponseEntity<Teacher> getTeacher(@PathVariable("id") String id) {
		
		return teacherService
					.findById(id)
					.map((teacher) -> ResponseEntity.ok().body(teacher))
					.orElseGet(() -> ResponseEntity.notFound().build());
				
	}
}

