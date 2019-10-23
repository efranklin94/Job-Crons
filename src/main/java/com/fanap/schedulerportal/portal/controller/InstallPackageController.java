package com.fanap.schedulerportal.portal.controller;

import com.fanap.schedulerportal.portal.entities.InstallPackage;
import com.fanap.schedulerportal.portal.repository.InstallPackageRepository;
import com.fanap.schedulerportal.portal.service.InstallPackageService;
import com.fanap.schedulerportal.portal.service.PluginModuleService;
import net.lingala.zip4j.core.ZipFile;
import org.quartz.JobDetail;
import org.quartz.SimpleScheduleBuilder;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.io.File;
import java.text.SimpleDateFormat;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Iterator;

@Controller
@RequestMapping("/")
public class InstallPackageController {
    @Autowired
    private InstallPackageService installPackageService;
    @Autowired
    protected PluginModuleService pluginModuleService;

    private Long startTime = 0L;
    private Long endTime = 0L;
    private int repeatHour = 0;

    @PostMapping("/addInstallPackage")
    public String createInstallPackage(@RequestParam("file") MultipartFile file ,RedirectAttributes redirectAttributes, Model model) {
        if (file.isEmpty()) {
            redirectAttributes.addFlashAttribute("message", "Please select a file to upload");
            return "redirect:uploadStatus";
        }
        installPackageService.deleteTmpFolder();
        File zip = installPackageService.saveFileToTmpFolder(file);
        installPackageService.unzipFileFromTmpFolder(zip);
        /*zip extracted to destination folder*/

        installPackageService.mapPackageManifestJSONToObject();
        pluginModuleService.mapPluginsJSONToObject();
//        cronJobSch();

        System.out.println(startTime);
        System.out.println(endTime);
        System.out.println(repeatHour);

        return "installPackages/add-installPackage";
    }

    @RequestMapping
    public String homeInstallPackageController(Model model) {


        model.addAttribute("startTime", startTime.toString());
        model.addAttribute("endTime", endTime.toString());
        model.addAttribute("repeatHour", repeatHour);

        return "installPackages/home";
    }

//    private Trigger buildJobTrigger(JobDetail jobDetail, Long startAt) {
//        return TriggerBuilder.newTrigger()
//                .forJob(jobDetail)
//                .withIdentity(jobDetail.getKey().getName(), "email-triggers")
//                .withDescription("Send Email Trigger")
//                .startAt(Date.from(startAt.toInstant()))
//                .withSchedule(SimpleScheduleBuilder.simpleSchedule().withMisfireHandlingInstructionFireNow())
//                .build();
//    }

//    @Scheduled(cron = "*/5 * * * * *")
//    public void cronJobSch() {
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
//        Date now = new Date();
//        String strDate = sdf.format(now);
//        System.out.println("Java cron job expression:: " + strDate);
//    }

//    @Scheduled(fixedRate = 1000)
//    public void scheduleFixedRateTask() {
//        System.out.println(
//                "Fixed rate task - " + System.currentTimeMillis() / 1000);
//    }

}
