package com.fanap.schedulerportal.portal.entities;

import javax.persistence.*;
import java.util.List;
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

    @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JoinColumn(name = "FORM_FK")
    private List<Form> forms;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "NOTIFYMEDIA_FK")
    private NotifyMedia notifyMedia;

    public PluginModule() {
    }

    public PluginModule(String pluginName, String pluginVersion, List<Form> forms, NotifyMedia notifyMedia) {
        this.pluginName = pluginName;
        this.pluginVersion = pluginVersion;
        this.forms = forms;
        this.notifyMedia = notifyMedia;
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

    public List<Form> getForms() {
        return forms;
    }

    public void setForms(List<Form> forms) {
        this.forms = forms;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PluginModule that = (PluginModule) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(pluginName, that.pluginName) &&
                Objects.equals(pluginVersion, that.pluginVersion) &&
                Objects.equals(forms, that.forms) &&
                Objects.equals(notifyMedia, that.notifyMedia);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, pluginName, pluginVersion, forms, notifyMedia);
    }

    @Override
    public String toString() {
        return "PluginModule{" +
                "id=" + id +
                ", pluginName='" + pluginName + '\'' +
                ", pluginVersion='" + pluginVersion + '\'' +
                ", forms=" + forms +
                ", notifyMedia=" + notifyMedia +
                '}';
    }

    public NotifyMedia getNotifyMedia() {
        return notifyMedia;
    }

    public void setNotifyMedia(NotifyMedia notifyMedia) {
        this.notifyMedia = notifyMedia;
    }
}
