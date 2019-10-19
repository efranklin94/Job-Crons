package com.fanap.schedulerportal.portal.repository;

import com.fanap.schedulerportal.portal.entities.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long> {
    User findByUsername(String username);

}
