package com.fanap.schedulerportal.portal.controller;

import org.springframework.stereotype.Component;

@Component
public class TriggerVO {
    private String startTime;
    private String endTime;
    private String repeatHour;

    public TriggerVO(String startTime, String endTime, String repeatHour) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.repeatHour = repeatHour;
    }

    public TriggerVO() {
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getRepeatHour() {
        return repeatHour;
    }

    public void setRepeatHour(String repeatHour) {
        this.repeatHour = repeatHour;
    }

}
