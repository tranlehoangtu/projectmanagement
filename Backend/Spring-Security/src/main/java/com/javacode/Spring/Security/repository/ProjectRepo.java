package com.javacode.Spring.Security.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.javacode.Spring.Security.domain.model.Project;

@Repository
public interface ProjectRepo extends MongoRepository<Project, String> {
	Optional<Project> findByProjectName(String projectName);
	List<Project> findByMembers(List<String> members);
}