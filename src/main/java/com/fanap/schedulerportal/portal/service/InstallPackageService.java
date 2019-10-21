package com.fanap.schedulerportal.portal.service;

import com.fanap.schedulerportal.portal.entities.InstallPackage;
import com.fanap.schedulerportal.portal.entities.PluginModule;
import com.fanap.schedulerportal.portal.repository.InstallPackageRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.lingala.zip4j.core.ZipFile;
import net.lingala.zip4j.exception.ZipException;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;
import java.io.FileReader;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.*;

@Service
public class InstallPackageService {
    @Autowired
    private InstallPackageRepository installPackageRepository;
    @Autowired
    private PluginModuleService pluginModuleService;

    private static final String UNZIPPINGPATH = "c://destination";

    public InstallPackage saveInstallPackageBundle(InstallPackage installPackage) {
        return installPackageRepository.save(installPackage);
    }

    public File saveFileToTmpFolder(MultipartFile file) {
        File zip = null;
        try {
            zip = File.createTempFile(UUID.randomUUID().toString(), "temp");
            FileOutputStream o = new FileOutputStream(zip);
            IOUtils.copy(file.getInputStream(), o);
            o.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return zip;
    }

    public void unzipFileFromTmpFolder(File zip) {

        ZipFile zipFile = null;
        try {
            zipFile = new ZipFile(zip);
            zipFile.extractAll(UNZIPPINGPATH);

        } catch (ZipException e) {
            e.printStackTrace();
        }
    }

    public void mapPackageManifestJSONToObject() {
        try {
            Object obj = new JSONParser().parse(new FileReader(UNZIPPINGPATH + "//plugins-index.manifest.json"));
            JSONObject jo = (JSONObject) obj;

            JSONObject packageNameObject = (JSONObject) jo.get("app");
            String packageName = (String) packageNameObject.get("name");

            InstallPackage installPackage = new InstallPackage();
            List<PluginModule> pluginModules = new ArrayList<>();

            installPackage.setPackageName(packageName);
//            installPackage.setFileLocation();
//
            Instant instant = Instant.now();
            installPackage.setCreationDate(instant.getEpochSecond());


            JSONArray pluginsObject = (JSONArray) jo.get("plugins");
            for (int i = 0; i < pluginsObject.size(); i++) {
                JSONObject object = (JSONObject) pluginsObject.get(i);
                PluginModule pluginModule = new PluginModule();
                pluginModule.setPluginName((String) object.get("name"));
                pluginModule.setPluginVersion((String) object.get("version-stable"));
                pluginModuleService.savePlugin(pluginModule);
                pluginModules.add(pluginModule);
            }

            installPackage.setPluginModules(pluginModules);
            installPackageRepository.save(installPackage);
//            installPackageRepository.findAll().forEach(System.out::println);

        } catch (IOException | ParseException e) {
            e.printStackTrace();
        }

    }

    public void deleteTmpFolder() {
        File index = new File(UNZIPPINGPATH);
        deleteDirectory(index);
    }

    public boolean deleteDirectory(File directoryToBeDeleted) {
        File[] allContents = directoryToBeDeleted.listFiles();
        if (allContents != null) {
            for (File file : allContents) {
                deleteDirectory(file);
            }
        }
        return directoryToBeDeleted.delete();
    }
}
//        try {
//            FileInputStream is = new FileInputStream("src/main/resources/users.json");
//            JsonParserFactory factory = Json.createParserFactory(null);
//            JsonParser parser = factory.createParser(is, StandardCharsets.UTF_8);
//            if (!parser.hasNext() && parser.next() != JsonParser.Event.START_ARRAY) {
//                return;
//            }
//
//            while (parser.hasNext()) {
//                JsonParser.Event event = parser.next();
//
//                if (event == JsonParser.Event.START_OBJECT) {
//                    while (parser.hasNext()) {
//                        event = parser.next();
//                        if (event == JsonParser.Event.KEY_NAME) {
//                            String key = parser.getString();
//                            switch (key) {
//                                case "name":
//                                    parser.next();
//
//                                    System.out.printf("Name: %s%n", parser.getString());
//                                    break;
//
//                                case "plugin-version":
//                                    parser.next();
//
//                                    System.out.printf("Occupation: %s%n", parser.getString());
//                                    break;
//
//                            }
//                        }
//                    }
//                }
//            }
//
//        } catch (FileNotFoundException e) {
//            e.printStackTrace();
//        }

    /*
    open zip and fetch wanted fields for entites
    set package bundle fields

     */
//    public InstallPackage[] ConvertJsonToObject (String json) {
//        InstallPackage [] products = new InstallPackage[0];
//        ObjectMapper objectMapper = new ObjectMapper();
//
//        try {
//            products = objectMapper.readValue(json, Product[].class);
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//
//        return products;
//    }

