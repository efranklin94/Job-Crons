package com.fanap.schedulerportal.portal.scheduler;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

public class SchemaVersionScheduler implements Job {
    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        //error checking
    }

//    Trigger fields
    private Long startDate;
    private Long endDate;
    private int repeatHour;

//    job fields

}
