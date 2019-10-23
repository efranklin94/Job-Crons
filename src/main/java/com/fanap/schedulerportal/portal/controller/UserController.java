package com.fanap.schedulerportal.portal.controller;

import com.fanap.schedulerportal.portal.entities.User;

import com.fanap.schedulerportal.portal.service.UserService;
import com.fanap.schedulerportal.portal.service.RecordNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @RequestMapping
    public String getAllUsers(Model model) {

        List<User> userList = (List<User>)
                userService.getAllPluginUsers();

        model.addAttribute("users", userList);
        return "list-users";
    }

    @RequestMapping(path = "/adduser", method = RequestMethod.POST)
    public String createUser(User user)
    {
        userService.savePluginUser(user);
        return "redirect:/";
    }


    @RequestMapping(path = {"/edit", "/edit/{id}"})
    public String editUserById(Model model, @PathVariable("id") Optional<Long> id) throws RecordNotFoundException {
        if (id.isPresent()) {
            User entity = userService.getUserById(id.get());
            model.addAttribute("user", entity);
        } else {
            model.addAttribute("user", new User());
        }
        return "add-user";
    }

    @RequestMapping(path = "/delete/{id}")
    public String deleteUserById(Model model, @PathVariable("id") Long id)
            throws RecordNotFoundException
    {
        userService.deleteUserById(id);
        return "redirect:/";
    }

}
//    private RoleService roleService;
//
//    @Autowired
//    public PluginUserController(PluginUserService pluginUserService, RoleService roleService) {
//        this.pluginUserService = pluginUserService;
//        this.roleService = roleService;
//    }
//    @GetMapping("/{username}")
//    public String getPluginUserByUsername(@PathVariable(value = "username") String username, Model model) {
//        model.addAttribute("user", pluginUserService.getPluginUserByUsername(username));
//        model.addAttribute("users", pluginUserService.getAllPluginUsers());
//        return "index";
//    }

//    public PluginUserController(PluginUserService pluginUserService) {
//        this.pluginUserService = pluginUserService;
//    }

//    @GetMapping("/signup")
//    public String showSignUpForm(PluginUser user) {
//        return "add-user";
//    }

//    @PostMapping("/adduser")
//    public String addUser(@Valid PluginUser user, Model model, BindingResult result) {
//        if (result.hasErrors()) {
//            return "add-user";
//        }
//
//        pluginUserService.savePluginUser(user);
//        model.addAttribute("users", pluginUserService);
//        return "index";
//    }
//        List<PluginUser> pluginUsers = new ArrayList<>();
//        pluginUserService.getAllPluginUsers().forEach(pluginUsers::add);
