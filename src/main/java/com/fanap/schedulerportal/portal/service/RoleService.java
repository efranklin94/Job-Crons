package com.fanap.schedulerportal.portal.service;

import com.fanap.schedulerportal.portal.entities.Role;
import com.fanap.schedulerportal.portal.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleService {
    private RoleRepository roleRepository;

    @Autowired
    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public Role createRole(String roleName) {
        if (roleRepository.findByRoleName(roleName) == null) {
            Role newRole = new Role(roleName);
            return roleRepository.save(newRole);
        }
        else {
            return null;
        }
    }


}
