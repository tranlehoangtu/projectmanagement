package com.javacode.Spring.Security.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.javacode.Spring.Security.domain.model.Comment;
import com.javacode.Spring.Security.repository.CommentRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {
	private final CommentRepo commentRepo;

	public Comment insert(Comment comment) {
		return commentRepo.insert(comment);
	}

	public Optional<Comment> findById(String id) {
		return commentRepo.findById(id);
	}

	public void delete(Comment comment) {
		commentRepo.delete(comment);
	}
	
	public Comment save(Comment comment) {
		return commentRepo.save(comment);
	}
}
