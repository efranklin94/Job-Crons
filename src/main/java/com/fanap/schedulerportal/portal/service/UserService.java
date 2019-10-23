package com.fanap.schedulerportal.portal.service;

import com.fanap.schedulerportal.portal.entities.User;
import com.fanap.schedulerportal.portal.entities.Role;
import com.fanap.schedulerportal.portal.repository.UserRepository;
import com.fanap.schedulerportal.portal.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private UserRepository userRepository;
    private RoleRepository roleRepository;

    @Autowired
    public UserService(UserRepository userRepository, RoleRepository roleRepository){
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    public User createPluginUser(String firstname, String lastname, String username, String password, List<Role> roles, String email) {
        List<Role> roleList = new ArrayList<>();
        for (Role role : roles
        ) {
            Role newRole = roleRepository.findByRoleName(role.getRoleName());
            if (newRole == null) {
                throw new RuntimeException("role does not exist");
            } else {
                roleList.add(newRole);
            }
        }
        return userRepository.save(new User(firstname,lastname,username,password,roleList,email));
    }

    public User savePluginUser(User user) {
        if(user.getId()  == null)
        {
            user = userRepository.save(user);
            return user;
        }
        else
        {
            Optional<User> user1 = userRepository.findById(user.getId());

            if(user1.isPresent())
            {
                User newEntity = user1.get();
                newEntity.setEmail(user.getEmail());
                newEntity.setFirstName(user.getFirstName());
                newEntity.setLastName(user.getLastName());
                newEntity.setUsername(user.getUsername());
                newEntity.setPassword(user.getPassword());
                newEntity.setRole(user.getRole());

                newEntity = userRepository.save(newEntity);

                return newEntity;
            } else {
                return userRepository.save(user);
            }
        }    }

    public Iterable<User> getAllPluginUsers() {
        List<User> users = (List<User>) userRepository.findAll();
        if(users.size() > 0) {
            return users;
        } else {
            return new ArrayList<>();
        }
    }

    public User getUserById(Long id) throws RecordNotFoundException
    {
        Optional<User> user = userRepository.findById(id);

        if(user.isPresent()) {
            return user.get();
        } else {
            throw new RecordNotFoundException("No user record exist for given id");
        }
    }

    public User getPluginUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public void deleteUserById(Long id) throws RecordNotFoundException
    {
        Optional<User> user = userRepository.findById(id);

        if(user.isPresent())
        {
            userRepository.deleteById(id);
        } else {
            throw new RecordNotFoundException("No user record exist for given id");
        }
    }

    public long count() {
        return userRepository.count();
    }
}
