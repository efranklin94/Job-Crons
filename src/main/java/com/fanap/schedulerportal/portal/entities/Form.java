package com.fanap.schedulerportal.portal.entities;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table
public class Form {
    @Id
    @SequenceGenerator(name = "FORM_SEQUENCE", sequenceName = "FORM_SEQUENCE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "FORM_SEQUENCE")
    private Long id;
    @Column
    private String processCode;
    @Column
    private String schemaVersion;

    public Form(String processCode, String schemaVersion) {
        this.processCode = processCode;
        this.schemaVersion = schemaVersion;
    }

    public Form() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProcessCode() {
        return processCode;
    }

    public void setProcessCode(String processCode) {
        this.processCode = processCode;
    }

    public String getSchemaVersion() {
        return schemaVersion;
    }

    public void setSchemaVersion(String schemaVersion) {
        this.schemaVersion = schemaVersion;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Form form = (Form) o;
        return Objects.equals(id, form.id) &&
                Objects.equals(processCode, form.processCode) &&
                Objects.equals(schemaVersion, form.schemaVersion);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, processCode, schemaVersion);
    }

    @Override
    public String toString() {
        return "Form{" +
                "id=" + id +
                ", processCode='" + processCode + '\'' +
                ", schemaVersion='" + schemaVersion + '\'' +
                '}';
    }
}
