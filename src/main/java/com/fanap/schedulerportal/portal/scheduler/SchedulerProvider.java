package com.fanap.schedulerportal.portal.scheduler;

import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.impl.StdSchedulerFactory;

public class SchedulerProvider {
    private static Scheduler scheduler = null;

    static  {
        try {
            scheduler = StdSchedulerFactory.getDefaultScheduler();
            scheduler.start();
        } catch (SchedulerException e) {
            e.printStackTrace();
        }
    }

    public static Scheduler getScheduler() {
        return scheduler;
    }













    public static void startScheduler() throws SchedulerException {
        scheduler.start();
    }

    public static void standbyScheduler() throws SchedulerException {
        scheduler.standby();
    }

    public static void main(String[] args) throws SchedulerException {
        Scheduler scheduler1 = SchedulerProvider.getScheduler();
        Scheduler scheduler = SchedulerProvider.getScheduler();

        scheduler.start();
        scheduler1.start();
    }

}
