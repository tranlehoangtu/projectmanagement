package com.javacode.Spring.Security.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.javacode.Spring.Security.domain.model.Task;

@Repository
public interface TaskRepo extends MongoRepository<Task, String> {
	@Query(value = "{ 'members' : {$all : [?0] }, 'projectId': ?1}")
	public List<Task> findByMembers(String members, String projectId);

	@Query(value = "{ 'projectId': ?0}")
	public List<Task> findByProjectId(String projectId);

}