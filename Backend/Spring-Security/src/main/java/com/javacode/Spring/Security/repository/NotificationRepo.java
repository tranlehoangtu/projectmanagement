package com.javacode.Spring.Security.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.javacode.Spring.Security.domain.model.Notification;

@Repository
public interface NotificationRepo extends MongoRepository<Notification, String> {

}