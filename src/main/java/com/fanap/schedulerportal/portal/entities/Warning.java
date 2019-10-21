package com.fanap.schedulerportal.portal.entities;

import javax.persistence.*;
import javax.print.attribute.standard.MediaSize;
import java.util.Objects;

@Entity
@Table(name = "WARNING_TABLE")
public class Warning extends BaseEntity<Long> {
    @Id
    @SequenceGenerator(name = "WARNING_SEQUENCE", sequenceName = "WARNING_SEQUENCE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "WARNING_SEQUENCE")
    private Long id;
    @Column
    private Long warningTime;
    @Column
    private String warningText;


    public Warning(Long warningTime, String warningText) {
        this.warningTime = warningTime;
        this.warningText = warningText;
    }

    public Warning() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getWarningTime() {
        return warningTime;
    }

    public void setWarningTime(Long warningTime) {
        this.warningTime = warningTime;
    }

    public String getWarningText() {
        return warningText;
    }

    public void setWarningText(String warningText) {
        this.warningText = warningText;
    }

    @Override
    public String toString() {
        return "Warning{" +
                "id=" + id +
                ", warningTime=" + warningTime +
                ", warningText='" + warningText + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Warning warning = (Warning) o;
        return Objects.equals(id, warning.id) &&
                Objects.equals(warningTime, warning.warningTime) &&
                Objects.equals(warningText, warning.warningText);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, warningTime, warningText);
    }
}
