//package com.fanap.schedulerportal.portal.scheduler;
//
//import org.quartz.Job;
//import org.quartz.JobDetail;
//
//import static org.quartz.JobBuilder.newJob;
//
//public class JobProvider {
//
//    public JobProvider (String jobId) {
//        JobDetail jobDetail = newJob(SchemaVersionJob.class)
//                .withIdentity(jobId, "group1")
//                .usingJobData("isConflicting", "false")
//                .build();
//
//
//
//}
