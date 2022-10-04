package com.javacode.Spring.Security.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.javacode.Spring.Security.domain.model.Notification;
import com.javacode.Spring.Security.repository.NotificationRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {
	private final NotificationRepo notificationRepo;

	public <S extends Notification> S save(S entity) {
		return notificationRepo.save(entity);
	}

	public <S extends Notification> S insert(S entity) {
		return notificationRepo.insert(entity);
	}

	public Optional<Notification> findById(String id) {
		return notificationRepo.findById(id);
	}

	
}
