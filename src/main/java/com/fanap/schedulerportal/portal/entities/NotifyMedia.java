package com.fanap.schedulerportal.portal.entities;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "NOTIFYMEDIA_TABLE")
public class NotifyMedia {
    @Id
    @SequenceGenerator(name = "NOTIFYMEDIA_SEQUENCE", sequenceName = "NOTIFYMEDIA_SEQUENCE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "NOTIFYMEDIA_SEQUENCE")
    private Long id;
    @Column
    private String mediaName;

    public NotifyMedia(String mediaName) {
        this.mediaName = mediaName;
    }

    public NotifyMedia() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMediaName() {
        return mediaName;
    }

    public void setMediaName(String mediaName) {
        this.mediaName = mediaName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        NotifyMedia that = (NotifyMedia) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(mediaName, that.mediaName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, mediaName);
    }

    @Override
    public String toString() {
        return "NotifyMedia{" +
                "id=" + id +
                ", mediaName='" + mediaName + '\'' +
                '}';
    }
}
