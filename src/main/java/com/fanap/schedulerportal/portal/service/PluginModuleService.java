package com.fanap.schedulerportal.portal.service;

import com.fanap.schedulerportal.portal.entities.Form;
import com.fanap.schedulerportal.portal.entities.InstallPackage;
import com.fanap.schedulerportal.portal.entities.PluginModule;
import com.fanap.schedulerportal.portal.repository.FormRepository;
import com.fanap.schedulerportal.portal.repository.InstallPackageRepository;
import com.fanap.schedulerportal.portal.repository.PluginModuleRepository;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class PluginModuleService {
    private FormService formService;
    private PluginModuleRepository pluginModuleRepository;

    private static final String UNZIPPINGPATH = "c://destination";
//    private static final String PLUGINMODULEPATH = "c://destination/";

    @Autowired
    public PluginModuleService(PluginModuleRepository pluginModuleRepository, FormService formService) {
        this.pluginModuleRepository = pluginModuleRepository;
        this.formService = formService;
    }



    public PluginModule savePlugin(PluginModule pluginModule) {
        return pluginModuleRepository.save(pluginModule);
    }

    public void mapPluginsJSONToObject() {
        PluginModule pluginModule = new PluginModule();
        List<Form> forms = new ArrayList<>();

        try {
            Object obj = new JSONParser().parse(new FileReader(UNZIPPINGPATH + "//plugins-index.manifest.json"));
            JSONObject jo = (JSONObject) obj;
            JSONArray pluginsObject = (JSONArray) jo.get("plugins");


            for (int i = 0; i < 1; i++) {
                JSONObject object = (JSONObject) pluginsObject.get(i);
                String pluginName = (String) object.get("name");
                pluginModule = pluginModuleRepository.findByPluginName(pluginName);
                Object obj2 = new JSONParser().parse(new FileReader(UNZIPPINGPATH + "//" + pluginName + "//plugin.manifest.json"));
                JSONObject jo2 = (JSONObject) obj2;

                JSONArray formControllers = (JSONArray) jo2.get("controllers");
                for (int j = 0; j < formControllers.size(); j++) {
                    JSONObject joController = (JSONObject) formControllers.get(j);
                    Form form = new Form();
                    form.setSchemaVersion((String) joController.get("schema-version"));
                    form.setProcessCode((String) joController.get("processCode"));
                    formService.saveForm(form);
                    forms.add(form);
                }
            }

            pluginModule.setForms(forms);
            pluginModuleRepository.save(pluginModule);



        } catch (IOException | ParseException e) {
            e.printStackTrace();
        }



    }

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
