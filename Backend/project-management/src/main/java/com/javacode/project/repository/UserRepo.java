package com.javacode.project.repository;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.javacode.project.domain.model.User;

public interface UserRepo extends MongoRepository<User, ObjectId> {
	Optional<User> findByUsername(String username);

}
