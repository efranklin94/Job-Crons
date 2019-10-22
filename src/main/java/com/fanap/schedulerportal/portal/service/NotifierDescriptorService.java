package com.fanap.schedulerportal.portal.service;

import com.fanap.schedulerportal.portal.repository.NotifierDescriptorRepository;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotifierDescriptorService {
    @Autowired
    private NotifierDescriptorRepository notifierDescriptorRepository;
    @Autowired
    private Scheduler scheduler;

    public void ScheduleJob(Long repeatHour, Long startDate, Long endDate, ) {

    }
}
