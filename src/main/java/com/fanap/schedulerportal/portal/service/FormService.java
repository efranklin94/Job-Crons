package com.fanap.schedulerportal.portal.service;

import com.fanap.schedulerportal.portal.entities.Form;
import com.fanap.schedulerportal.portal.repository.FormRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FormService {
    @Autowired
    private FormRepository formRepository;

    public Form saveForm(Form form) {
        return formRepository.save(form);
    }
}
