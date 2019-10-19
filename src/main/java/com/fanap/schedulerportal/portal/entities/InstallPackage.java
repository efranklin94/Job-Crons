package com.fanap.schedulerportal.portal.entities;

import javax.persistence.*;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "INSTALLPACKAGE_TABLE")
public class InstallPackage extends BaseEntity<Long> {
    @Id
    @SequenceGenerator(name = "INSTALLPACKAGE_SEQUENCE", sequenceName = "INSTALLPACKAGE_SEQUENCE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "INSTALLPACKAGE_SEQUENCE")
    private Long id;
    @Column
    private String packageName;
    @Column
    private String fileLocation;

    @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JoinColumn(name = "PLUGINMODULE_FK")
    private List<PluginModule> pluginModules;

    public InstallPackage(String packageName, String fileLocation, List<PluginModule> pluginModules) {
        this.packageName = packageName;
        this.fileLocation = fileLocation;
        this.pluginModules = pluginModules;
    }

    public InstallPackage() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getFileLocation() {
        return fileLocation;
    }

    public void setFileLocation(String fileLocation) {
        this.fileLocation = fileLocation;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        InstallPackage that = (InstallPackage) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(packageName, that.packageName) &&
                Objects.equals(fileLocation, that.fileLocation) &&
                Objects.equals(pluginModules, that.pluginModules);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, packageName, fileLocation, pluginModules);
    }

    @Override
    public String toString() {
        return "InstallPackage{" +
                "id=" + id +
                ", packageName='" + packageName + '\'' +
                ", fileLocation='" + fileLocation + '\'' +
                ", pluginModules=" + pluginModules +
                '}';
    }
}
