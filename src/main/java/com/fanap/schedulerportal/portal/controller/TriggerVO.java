package com.fanap.schedulerportal.portal.controller;

public class TriggerVO {
    private Long startTime;
    private Long endTime;
    private int repeatHour;

    public TriggerVO() {
    }

    public Long getStartTime() {
        return startTime;
    }

    public void setStartTime(Long startTime) {
        this.startTime = startTime;
    }

    public Long getEndTime() {
        return endTime;
    }

    public void setEndTime(Long endTime) {
        this.endTime = endTime;
    }

    public int getRepeatHour() {
        return repeatHour;
    }

    public void setRepeatHour(int repeatHour) {
        this.repeatHour = repeatHour;
    }
}
