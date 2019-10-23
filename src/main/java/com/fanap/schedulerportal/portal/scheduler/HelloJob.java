package com.fanap.schedulerportal.portal.scheduler;

import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HelloJob implements Job {
    private static final Logger logger = LoggerFactory.getLogger(HelloJob.class);


    public HelloJob() {
        System.out.println("hi im created");

    }

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
//        JobDataMap data = jobExecutionContext.getMergedJobDataMap();
//        data.put("eddy","1");
//        System.out.println("eddy = " + data.getString("eddy"));
        System.out.println("Executing Job with key {}" + jobExecutionContext.getJobDetail().getKey().toString());

    }
}
