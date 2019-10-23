package com.fanap.schedulerportal.portal.repository;

import com.fanap.schedulerportal.portal.entities.Role;
import org.springframework.data.repository.CrudRepository;

public interface RoleRepository extends CrudRepository<Role, Long> {
    Role findByRoleName(String roleName);

}
