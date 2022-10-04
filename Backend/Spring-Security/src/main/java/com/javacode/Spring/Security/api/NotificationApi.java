package com.javacode.Spring.Security.api;

import javax.annotation.security.RolesAllowed;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.javacode.Spring.Security.domain.model.Notification;
import com.javacode.Spring.Security.domain.model.Role;
import com.javacode.Spring.Security.service.NotificationService;

import lombok.RequiredArgsConstructor;

@CrossOrigin
@RequestMapping("api")
@RequiredArgsConstructor
@RestController
public class NotificationApi {

	private final NotificationService notificationService;
	
	@RolesAllowed({ Role.MANAGEMENT, Role.STUDENT })
	@GetMapping("notification/{id}")
	public ResponseEntity<Notification> getNotification(@PathVariable("id") String id) {
		return notificationService
				.findById(id)
				.map(notification -> ResponseEntity.ok().body(notification))
				.orElseGet(() -> ResponseEntity.notFound().build());
	}
}
