package com.fanap.schedulerportal.portal.scheduler;

import org.quartz.*;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

import static org.quartz.JobBuilder.newJob;
import static org.quartz.JobKey.jobKey;
import static org.quartz.SimpleScheduleBuilder.simpleSchedule;
import static org.quartz.TriggerBuilder.newTrigger;
import static org.quartz.TriggerKey.triggerKey;
import static org.quartz.impl.matchers.GroupMatcher.groupEquals;

@Service
public class JobService {

    public static JobDetail createJob(String jobId) {
        JobDetail jobDetail = newJob(SchemaVersionJob.class)
            .withIdentity(jobId, "group1")
            .usingJobData("isConflicting", "false")
            .build();
        return jobDetail;
    }

    public static void deleteJobFromScheduler(Scheduler scheduler, String jobId) throws SchedulerException {
        scheduler.deleteJob(jobKey(jobId, "group1"));
    }

    public static void unscheduleJobFromScheduler(Scheduler scheduler, String triggerName) throws SchedulerException {
        scheduler.unscheduleJob(triggerKey(triggerName, "group1"));
    }

    public static void storeJobForLater(Scheduler scheduler, JobDetail job, String jobId) throws SchedulerException {
        // Define a durable job instance (durable jobs can exist without triggers)
        newJob(SchemaVersionJob.class)
                .withIdentity(jobId, "group1")
                .storeDurably()
                .build();

// Add the the job to the scheduler's store
        scheduler.addJob(job, false);
    }

    public static void scheduleJob(Scheduler scheduler, String jobId, String triggerName) throws SchedulerException {


// Schedule the trigger
//        scheduler.scheduleJob(jobKey(jobId, "group1"), triggerKey(triggerName, "group1"));
    }

    public static void updateJob(Scheduler scheduler, String jobId) throws SchedulerException {
        // Add the new job to the scheduler, instructing it to "replace"
//  the existing job with the given name and group (if any)
        JobDetail job1 = newJob(SchemaVersionJob.class)
                .withIdentity(jobId, "group1")
                .build();

// store, and set overwrite flag to 'true'
        scheduler.addJob(job1, true);
    }

    public static void updateTrigger(Scheduler scheduler, String triggerName, Long startTime, Long endTime, int hour, String oldTriggerName) throws SchedulerException {
        // Define a new Trigger
        Trigger trigger = createTrigger(triggerName, startTime, endTime, hour);

// tell the scheduler to remove the old trigger with the given key, and put the new one in its place
        scheduler.rescheduleJob(triggerKey(oldTriggerName, "group1"), trigger);
    }

    public static void findAllJobs(Scheduler scheduler) throws SchedulerException {
        // enumerate each job group
        for(String group: scheduler.getJobGroupNames()) {
            // enumerate each job in group
            for(JobKey jobKey : scheduler.getJobKeys(groupEquals(group))) {
                System.out.println("Found job identified by: " + jobKey);
            }
        }
    }

    public static void findAllTriggers(Scheduler scheduler) throws SchedulerException {
        // enumerate each trigger group
        for(String group: scheduler.getTriggerGroupNames()) {
            // enumerate each trigger in group
            for(TriggerKey triggerKey : scheduler.getTriggerKeys(groupEquals(group))) {
                System.out.println("Found trigger identified by: " + triggerKey);
            }
        }
    }

    public static List<Trigger> getTriggersOfJob(Scheduler scheduler, String jobId) throws SchedulerException {
        return (List<Trigger>) scheduler.getTriggersOfJob(jobKey(jobId, "group1"));
    }

    public static Trigger createTrigger(String triggerName, Long startDate, Long endDate, int hour) {
        Trigger t = newTrigger()
                .withIdentity(triggerName, "group1")
                .startAt(new Date(startDate))

                .withSchedule(simpleSchedule()
                        .withIntervalInSeconds(hour)
                        .repeatForever())

                .endAt(new Date(endDate))
                .build();

        return t;
    }

    public static void main(String[] args) throws SchedulerException, InterruptedException {
        Scheduler scheduler = SchedulerProvider.getScheduler();
        Long startTime = System.currentTimeMillis();
        Long endTime = startTime + 15000L;
        int hour = 5;


        JobDetail job = createJob("j1");
        Trigger trigger = createTrigger("t1", startTime, endTime, hour);
        JobDetail job2 = createJob("j2");
        Trigger trigger2 = createTrigger("t2",startTime + 2000L,endTime + 3000L, hour);

        scheduler.scheduleJob(job, trigger);
        scheduler.scheduleJob(job2, trigger2);

        Thread.sleep(1000L);
        System.out.println("/n/n/n***************/n/n listing all jobs and triggers");
        findAllJobs(scheduler);
        findAllTriggers(scheduler);
        System.out.println("/n/n/n***************/n/n ");

        System.out.println("/n/n/n *** LISTING ALL TRIGGERS FOR SPECIFIC JOBS *** /n/n/n/n");
        Thread.sleep(1000L);
        getTriggersOfJob(scheduler, "j1").forEach(System.out::println);
        getTriggersOfJob(scheduler, "j2").forEach(System.out::println);

        System.out.println("/n/n/n *** UNSCHEDULING T1 *** /n/n/n/n");
        Thread.sleep(10000L);
        unscheduleJobFromScheduler(scheduler, "t1");
        System.out.println("/n/n/n***************/n/n listing all jobs and triggers");
        findAllJobs(scheduler);
        findAllTriggers(scheduler);
        System.out.println("/n/n/n***************/n/n ");


        System.out.println("/n/n/n *** UNSCHEDULING T2 *** /n/n/n/n");
        Thread.sleep(15000L);
        unscheduleJobFromScheduler(scheduler, "t2");
        System.out.println("/n/n/n***************/n/n listing all jobs and triggers");
        findAllJobs(scheduler);
        findAllTriggers(scheduler);
        System.out.println("/n/n/n***************/n/n ");


        System.out.println("/n/n/n *** SCHEDULING T2 *** /n/n/n/n");
        Thread.sleep(10000L);
        scheduler.scheduleJob(job2, trigger2);
        System.out.println("/n/n/n***************/n/n listing all jobs and triggers");
        findAllJobs(scheduler);
        findAllTriggers(scheduler);
        System.out.println("/n/n/n***************/n/n ");

        System.out.println("/n/n/n *** CREATING NEW TRIGGER FOR J2 *** /n/n/n/n");
        Thread.sleep(5000L);
        updateTrigger(scheduler, "t3", System.currentTimeMillis(), System.currentTimeMillis() + 10000L, 1, "t2");
        System.out.println("/n/n/n***************/n/n listing all jobs and triggers");
        findAllJobs(scheduler);
        findAllTriggers(scheduler);
        System.out.println("/n/n/n***************/n/n ");

    }

}
