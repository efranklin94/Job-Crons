package com.fanap.schedulerportal.portal.entities;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "TRIGGER_TABLE")
public class TriggerVO {
    @Id
    @SequenceGenerator(name = "TRIGGER_SEQUENCE", sequenceName = "TRIGGER_SEQUENCE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "TRIGGER_SEQUENCE")
    private Long id;
    @Column
    private Long startTime;
    @Column
    private Long endTime;
    @Column
    private int repeatHour;

    public TriggerVO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public TriggerVO(Long startTime, Long endTime, int repeatHour) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.repeatHour = repeatHour;
    }

    @Override
    public String toString() {
        return "TriggerVO{" +
                "id=" + id +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", repeatHour=" + repeatHour +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TriggerVO triggerVO = (TriggerVO) o;
        return repeatHour == triggerVO.repeatHour &&
                Objects.equals(id, triggerVO.id) &&
                Objects.equals(startTime, triggerVO.startTime) &&
                Objects.equals(endTime, triggerVO.endTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, startTime, endTime, repeatHour);
    }
}
