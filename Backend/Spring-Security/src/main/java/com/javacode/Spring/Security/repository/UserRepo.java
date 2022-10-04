package com.javacode.Spring.Security.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.javacode.Spring.Security.domain.model.Role;
import com.javacode.Spring.Security.domain.model.User;

import lombok.RequiredArgsConstructor;

@Repository
public interface UserRepo extends MongoRepository<User, String>, UserRepoCustom {
	Optional<User> findByUsername(String username);
}

interface UserRepoCustom {
	List<User> findByUsernameContaining(String id);

	List<User> findByUsernameContainingAndAuthority(String id, Role role);
}

@RequiredArgsConstructor
class UserRepoCustomImpl implements UserRepoCustom {

	private final MongoTemplate mongoTemplate;

	@Override
	public List<User> findByUsernameContaining(String username) {
		Criteria regex = Criteria.where("username").regex(".*" + username + ".*");
		return mongoTemplate.find(new Query().addCriteria(regex), User.class);
	}

	@Override
	public List<User> findByUsernameContainingAndAuthority(String username, Role role) {
		Criteria regex = Criteria.where("username").regex(".*" + username + ".*").and("authorities").is(role);
		return mongoTemplate.find(new Query().addCriteria(regex), User.class);
	}

}
