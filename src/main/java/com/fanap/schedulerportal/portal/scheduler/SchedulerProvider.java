package com.fanap.schedulerportal.portal.scheduler;

import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.impl.StdSchedulerFactory;

public class SchedulerProvider {
    private static Scheduler scheduler = null;

    static  {
        try {
            scheduler = StdSchedulerFactory.getDefaultScheduler();
        } catch (SchedulerException e) {
            e.printStackTrace();
        }
    }

    public static Scheduler getScheduler() {
        return scheduler;
    }

}
