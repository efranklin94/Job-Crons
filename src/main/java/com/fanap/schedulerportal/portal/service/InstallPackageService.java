package com.fanap.schedulerportal.portal.service;

import com.fanap.schedulerportal.portal.entities.TriggerVO;
import com.fanap.schedulerportal.portal.entities.InstallPackage;
import com.fanap.schedulerportal.portal.entities.NotifierDescriptor;
import com.fanap.schedulerportal.portal.entities.PluginModule;
import com.fanap.schedulerportal.portal.repository.InstallPackageRepository;
import com.fanap.schedulerportal.portal.repository.NotifierDescriptorRepository;
import com.fanap.schedulerportal.portal.scheduler.JobService;
import com.fanap.schedulerportal.portal.scheduler.SchedulerProvider;
import net.lingala.zip4j.core.ZipFile;
import net.lingala.zip4j.exception.ZipException;
import org.apache.commons.io.IOUtils;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
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
    @Autowired
    private NotifierDescriptorRepository notifierDescriptorRepository;

    String jobId;
    Long lastLaunchTime;
    //WINDOWS
//    private static final String UNZIPPINGPATH = "c://destination";
    //LINUX
    private static final String UNZIPPINGPATH = "/home/edris/destination";
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

    public void mapPackageManifestJSONToObject(TriggerVO trigger) {
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

            NotifierDescriptor descriptor = new NotifierDescriptor();
            descriptor.setTrigger(trigger);
            descriptor.setInstallPackage(installPackage);
            descriptor.setJobId(jobId);
            descriptor.setCreationDate(System.currentTimeMillis());
            descriptor.setLastLaunchTime(lastLaunchTime);

            /***ADDITIONAL SETTERS FOR DESCRIPTOR***/
            notifierDescriptorRepository.save(descriptor);
            installPackage.setNotifierDescriptor(descriptor);
            installPackage.setPluginModules(pluginModules);
            installPackage.setCreationDate(System.currentTimeMillis());
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

    public InstallPackage getUserById(Long id) throws RecordNotFoundException
    {
        Optional<InstallPackage> user = installPackageRepository.findById(id);

        if(user.isPresent()) {
            return user.get();
        } else {
            throw new RecordNotFoundException("No installPackage record exist for given id");
        }
    }
    public Iterable<InstallPackage> getAllPackages() {
        List<InstallPackage> users = (List<InstallPackage>) installPackageRepository.findAll();
        if(users.size() > 0) {
            return users;
        } else {
            return new ArrayList<>();
        }
    }

    public void setJob(String installPackageJobName, String triggerName, Long startTime, Long endTime, int hour) throws SchedulerException {
        Scheduler scheduler = SchedulerProvider.getScheduler();
        scheduler.scheduleJob(JobService.createJob(installPackageJobName), JobService.createTrigger(triggerName, startTime, endTime, hour));
        jobId = installPackageJobName;
        lastLaunchTime = System.currentTimeMillis();
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

