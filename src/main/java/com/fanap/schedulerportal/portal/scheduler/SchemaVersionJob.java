package com.fanap.schedulerportal.portal.scheduler;

import org.quartz.*;

import java.util.Date;
import java.util.List;

import static org.quartz.JobBuilder.newJob;
import static org.quartz.JobKey.jobKey;
import static org.quartz.SimpleScheduleBuilder.simpleSchedule;
import static org.quartz.TriggerBuilder.newTrigger;
import static org.quartz.TriggerKey.triggerKey;
import static org.quartz.impl.matchers.GroupMatcher.groupEquals;

public class SchemaVersionJob implements Job {

    private boolean isConflicting = false;

    public SchemaVersionJob() {

    }

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        //check error

        //set the warning if error occurs
        JobDataMap data = jobExecutionContext.getMergedJobDataMap();
        System.out.println("SchemaVersion conflicting status = " + data.getString("isConflicting"));
    }


    public static void main(String[] args) throws SchedulerException {

    }







//    Trigger fields
//    private Long startDate;
//    private Long endDate;
//    private int repeatHour;
//
////    job fields
//    private String jobId;
//
//
//    public SchemaVersionJob(Long startDate, Long endDate, int repeatHour, String jobId) {
//        this.startDate = startDate;
//        this.endDate = endDate;
//        this.repeatHour = repeatHour;
//        this.jobId = jobId;
//    }
//
//    public Long getStartDate() {
//        return startDate;
//    }
//
//    public void setStartDate(Long startDate) {
//        this.startDate = startDate;
//    }
//
//    public Long getEndDate() {
//        return endDate;
//    }
//
//    public void setEndDate(Long endDate) {
//        this.endDate = endDate;
//    }
//
//    public int getRepeatHour() {
//        return repeatHour;
//    }
//
//    public void setRepeatHour(int repeatHour) {
//        this.repeatHour = repeatHour;
//    }
//
//    public String getJobId() {
//        return jobId;
//    }
//
//    public void setJobId(String jobId) {
//        this.jobId = jobId;
//    }
//
//    public void checkSchemaVersion() {
//
//    }
//
//    public void warn() {
//
//    }

}
