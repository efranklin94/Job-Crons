package com.fanap.schedulerportal.portal;

import com.fanap.schedulerportal.portal.repository.UserRepository;
import com.fanap.schedulerportal.portal.repository.RoleRepository;
import com.fanap.schedulerportal.portal.scheduler.SchedulerProvider;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PortalApplication implements Runnable{
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    UserRepository userRepository;
    public static void main(String[] args)  {
        SpringApplication.run(PortalApplication.class, args);
    }


    @Override
    public void run() {
        Scheduler scheduler = SchedulerProvider.getScheduler();
        try {
            scheduler.start();
        } catch (SchedulerException e) {
            e.printStackTrace();
        }
    }
}
