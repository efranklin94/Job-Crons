package com.fanap.schedulerportal.portal;

import com.fanap.schedulerportal.portal.repository.UserRepository;
import com.fanap.schedulerportal.portal.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PortalApplication {
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    UserRepository userRepository;
    public static void main(String[] args)  {
        SpringApplication.run(PortalApplication.class, args);
    }


}
