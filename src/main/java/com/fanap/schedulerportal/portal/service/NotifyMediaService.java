package com.fanap.schedulerportal.portal.service;

import com.fanap.schedulerportal.portal.entities.NotifyMedia;
import com.fanap.schedulerportal.portal.repository.NotifyMediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotifyMediaService {
    @Autowired
    private NotifyMediaRepository notifyMediaRepository;
    private static final String UNZIPPINGPATH = "c://destination";


    public NotifyMedia saveNotifyMedia(NotifyMedia notifyMedia) {
        return notifyMediaRepository.save(notifyMedia);
    }
}
