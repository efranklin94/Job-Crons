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
    private boolean enabled;
    @Column
    private Long lastLaunchTime;
    @Column
    private String jobId;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "WARNING_FK")
    private List<Warning> warnings;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "ENABLED_MEDIA")
    private NotifyMedia enabledMedia;

    @OneToOne(mappedBy = "descriptor")
    private InstallPackage installPackage;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "TRIGGER_FK")
    private TriggerVO trigger;

    public NotifierDescriptor() {
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public InstallPackage getInstallPackage() {
        return installPackage;
    }

    public void setInstallPackage(InstallPackage installPackage) {
        this.installPackage = installPackage;
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

    public TriggerVO getTrigger() {
        return trigger;
    }

    public void setTrigger(TriggerVO trigger) {
        this.trigger = trigger;
    }


    public Long getLastLaunchTime() {
        return lastLaunchTime;
    }

    public void setLastLaunchTime(Long lastLaunchTime) {
        this.lastLaunchTime = lastLaunchTime;
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public List<Warning> getWarnings() {
        return warnings;
    }

    public void setWarnings(List<Warning> warnings) {
        this.warnings = warnings;
    }

    public NotifyMedia getEnabledMedia() {
        return enabledMedia;
    }

    public void setEnabledMedia(NotifyMedia enabledMedia) {
        this.enabledMedia = enabledMedia;
    }

    @Override
    public String toString() {
        return "NotifierDescriptor{" +
                "id=" + id +
                ", mmpServerAddress='" + mmpServerAddress + '\'' +
                ", enabled=" + enabled +
                ", lastLaunchTime='" + lastLaunchTime + '\'' +
                ", jobId='" + jobId + '\'' +
                ", warnings=" + warnings +
                ", enabledMedia=" + enabledMedia +
                ", installPackage=" + installPackage +
                ", trigger=" + trigger +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        NotifierDescriptor that = (NotifierDescriptor) o;
        return enabled == that.enabled &&
                Objects.equals(id, that.id) &&
                Objects.equals(mmpServerAddress, that.mmpServerAddress) &&
                Objects.equals(lastLaunchTime, that.lastLaunchTime) &&
                Objects.equals(jobId, that.jobId) &&
                Objects.equals(warnings, that.warnings) &&
                Objects.equals(enabledMedia, that.enabledMedia) &&
                Objects.equals(installPackage, that.installPackage) &&
                Objects.equals(trigger, that.trigger);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, mmpServerAddress, enabled, lastLaunchTime, jobId, warnings, enabledMedia, installPackage, trigger);
    }
}
