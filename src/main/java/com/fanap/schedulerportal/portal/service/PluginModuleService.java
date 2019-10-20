package com.fanap.schedulerportal.portal.service;

import com.fanap.schedulerportal.portal.entities.InstallPackage;
import com.fanap.schedulerportal.portal.entities.PluginModule;
import com.fanap.schedulerportal.portal.repository.PluginModuleRepository;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileReader;
import java.io.IOException;

@Service
public class PluginModuleService {
    private PluginModuleRepository pluginModuleRepository;
    private static final String PLUGINMODULEJSONPATH = "c://destination/plugins-index.manifest.json";

    @Autowired
    public PluginModuleService(PluginModuleRepository pluginModuleRepository) {
        this.pluginModuleRepository = pluginModuleRepository;
    }


//    public PluginModule savePluginModule() {
//        try {
//            Object obj = new JSONParser().parse(new FileReader(PLUGINMODULEJSONPATH));
//            JSONObject jo = (JSONObject) obj;
//            System.out.println(jo);
//
//
//
//
//
//        } catch (IOException | ParseException e) {
//            e.printStackTrace();
//        }
//
//    }

    public PluginModule savePlugin(PluginModule pluginModule) {
        return pluginModuleRepository.save(pluginModule);
    }

}
