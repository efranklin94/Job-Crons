package com.fanap.schedulerportal.portal.entities;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "ROLE_TABLE")
public class Role extends BaseEntity<Long>  {
    @Id
    @SequenceGenerator(name = "ROLE_SEQUENCE", sequenceName = "ROLE_SEQUENCE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "ROLE_SEQUENCE")
    private Long id;
    @Column
    private String roleName;

    public Role() {
    }

    public Role(String roleName) {
        this.roleName = roleName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    @Override
    public String toString() {
        return "Role{" +
                "id=" + id +
                ", roleName='" + roleName + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Role role = (Role) o;
        return id == role.id &&
                Objects.equals(roleName, role.roleName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, roleName);
    }
}
