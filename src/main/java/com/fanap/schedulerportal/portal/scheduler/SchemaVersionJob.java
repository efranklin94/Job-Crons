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
        Scheduler sched = SchedulerProvider.getScheduler();

        JobDetail job1 = newJob(SchemaVersionJob.class)
                .withIdentity("job1", "group1")
                .usingJobData("isConflicting", "is Conflicting")
                .build();

        // Define a Trigger that will fire "now", and not repeat
        Trigger trigger = newTrigger()
                .withIdentity("trigger1", "group1")
                .startNow()
                .build();

    // Schedule the job with the trigger
        sched.scheduleJob(job1, trigger);
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
