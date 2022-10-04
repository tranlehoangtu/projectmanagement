package com.javacode.Spring.Security.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.javacode.Spring.Security.domain.model.Student;

@Repository
public interface StudentRepo extends MongoRepository<Student, String> {
	Optional<Student> findByStudentId(String studentId);
	Optional<Student> findByUserId(String userId);
}
