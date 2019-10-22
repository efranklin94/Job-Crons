package com.fanap.schedulerportal.portal.scheduler;

import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

public class HelloJob implements Job {

    public HelloJob() {
        System.out.println("hi im created");
    }

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
//        JobDataMap data = jobExecutionContext.getMergedJobDataMap();
//        data.put("eddy","1");
//        System.out.println("eddy = " + data.getString("eddy"));
    }
}
