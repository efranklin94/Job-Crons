package com.fanap.schedulerportal.portal.entities;

import javax.persistence.*;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "NOTIFIERDESCRIPTOR_TABLE")
public class NotifierDescriptor extends BaseEntity<Long> {
    @Id
    @SequenceGenerator(name = "NOTIFIERDESCRIPTOR_SEQUENCE", sequenceName = "NOTIFIERDESCRIPTOR_SEQUENCE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "NOTIFIERDESCRIPTOR_SEQUENCE")
    private Long id;
    @Column
    private String mmpServerAddress;
    @Column
    private boolean cronTrigger;
    @Column
    private boolean created;
    @Column
    private String lastLaunchTime;
    @Column
    private Long jobId;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "WARNING_FK")
    private List<Warning> warnings;

    public NotifierDescriptor(String mmpServerAddress, boolean cronTrigger, boolean created, String lastLaunchTime, Long jobId, List<Warning> warnings) {
        this.mmpServerAddress = mmpServerAddress;
        this.cronTrigger = cronTrigger;
        this.created = created;
        this.lastLaunchTime = lastLaunchTime;
        this.jobId = jobId;
        this.warnings = warnings;
    }

    public NotifierDescriptor() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMmpServerAddress() {
        return mmpServerAddress;
    }

    public void setMmpServerAddress(String mmpServerAddress) {
        this.mmpServerAddress = mmpServerAddress;
    }

    public boolean isCronTrigger() {
        return cronTrigger;
    }

    public void setCronTrigger(boolean cronTrigger) {
        this.cronTrigger = cronTrigger;
    }

    public boolean isCreated() {
        return created;
    }

    public void setCreated(boolean created) {
        this.created = created;
    }

    public String getLastLaunchTime() {
        return lastLaunchTime;
    }

    public void setLastLaunchTime(String lastLaunchTime) {
        this.lastLaunchTime = lastLaunchTime;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public List<Warning> getWarnings() {
        return warnings;
    }

    public void setWarnings(List<Warning> warnings) {
        this.warnings = warnings;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        NotifierDescriptor that = (NotifierDescriptor) o;
        return cronTrigger == that.cronTrigger &&
                created == that.created &&
                Objects.equals(id, that.id) &&
                Objects.equals(mmpServerAddress, that.mmpServerAddress) &&
                Objects.equals(lastLaunchTime, that.lastLaunchTime) &&
                Objects.equals(jobId, that.jobId) &&
                Objects.equals(warnings, that.warnings);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, mmpServerAddress, cronTrigger, created, lastLaunchTime, jobId, warnings);
    }

    @Override
    public String toString() {
        return "NoitifierDescriptor{" +
                "id=" + id +
                ", mmpServerAddress='" + mmpServerAddress + '\'' +
                ", cronTrigger=" + cronTrigger +
                ", created=" + created +
                ", lastLaunchTime='" + lastLaunchTime + '\'' +
                ", jobId=" + jobId +
                ", warnings=" + warnings +
                '}';
    }
}
