package com.fanap.schedulerportal.portal.repository;

import com.fanap.schedulerportal.portal.entities.InstallPackage;
import com.fanap.schedulerportal.portal.entities.NotifierDescriptor;
import org.springframework.data.repository.CrudRepository;

public interface InstallPackageRepository extends CrudRepository<InstallPackage, Long> {
}
