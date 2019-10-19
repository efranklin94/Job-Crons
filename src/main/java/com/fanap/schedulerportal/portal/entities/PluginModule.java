package com.fanap.schedulerportal.portal.entities;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "PLUGINMODULE_TABLE")
public class PluginModule {
    @Id
    @SequenceGenerator(name = "PLUGINMODULE_SEQUENCE", sequenceName = "PLUGINMODULE_SEQUENCE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "PLUGINMODULE_SEQUENCE")
    private Long id;
    @Column
    private String pluginName;
    @Column
    private String pluginVersion;
    @Column
    private String schemaVersion;

    public PluginModule(String pluginName, String pluginVersion, String schemaVersion) {
        this.pluginName = pluginName;
        this.pluginVersion = pluginVersion;
        this.schemaVersion = schemaVersion;
    }

    public PluginModule() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPluginName() {
        return pluginName;
    }

    public void setPluginName(String pluginName) {
        this.pluginName = pluginName;
    }

    public String getPluginVersion() {
        return pluginVersion;
    }

    public void setPluginVersion(String pluginVersion) {
        this.pluginVersion = pluginVersion;
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
        PluginModule that = (PluginModule) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(pluginName, that.pluginName) &&
                Objects.equals(pluginVersion, that.pluginVersion) &&
                Objects.equals(schemaVersion, that.schemaVersion);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, pluginName, pluginVersion, schemaVersion);
    }

    @Override
    public String toString() {
        return "PluginModule{" +
                "id=" + id +
                ", pluginName='" + pluginName + '\'' +
                ", pluginVersion='" + pluginVersion + '\'' +
                ", schemaVersion='" + schemaVersion + '\'' +
                '}';
    }
}
