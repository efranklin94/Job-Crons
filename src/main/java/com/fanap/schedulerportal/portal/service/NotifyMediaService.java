package com.fanap.schedulerportal.portal.service;

import com.fanap.schedulerportal.portal.entities.NotifyMedia;
import com.fanap.schedulerportal.portal.repository.NotifyMediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotifyMediaService {
    @Autowired
    private NotifyMediaRepository notifyMediaRepository;
    //WINDOWS
//    private static final String UNZIPPINGPATH = "c://destination";
    //LINUX
    private static final String UNZIPPINGPATH = "/home/edris/destination";


    public NotifyMedia saveNotifyMedia(NotifyMedia notifyMedia) {
        return notifyMediaRepository.save(notifyMedia);
    }
}
