package com.fanap.schedulerportal.portal.controller;

import com.fanap.schedulerportal.portal.entities.InstallPackage;
import com.fanap.schedulerportal.portal.entities.TriggerVO;
import com.fanap.schedulerportal.portal.repository.TriggerVORepository;
import com.fanap.schedulerportal.portal.service.InstallPackageService;
import com.fanap.schedulerportal.portal.service.PluginModuleService;
import com.fanap.schedulerportal.portal.service.RecordNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.io.File;
import java.util.Optional;

@Controller
@RequestMapping("/")
public class InstallPackageController {
    @Autowired
    private InstallPackageService installPackageService;
    @Autowired
    private PluginModuleService pluginModuleService;

    @PostMapping("/addInstallPackage")
    public String createInstallPackage(@RequestParam("file") MultipartFile file ,RedirectAttributes redirectAttributes,@ModelAttribute("trigger") TriggerVO trigger) {
        if (file.isEmpty()) {
            redirectAttributes.addFlashAttribute("message", "Please select a file to upload");
            return "redirect:uploadStatus";
        }
        installPackageService.deleteTmpFolder();
        File zip = installPackageService.saveFileToTmpFolder(file);
        installPackageService.unzipFileFromTmpFolder(zip);
        /*zip extracted to destination folder*/

        installPackageService.mapPackageManifestJSONToObject(trigger);
        pluginModuleService.mapPluginsJSONToObject();

        return "redirect:/";
    }

    @RequestMapping
    public String homeInstallPackageController(Model model) {
        model.addAttribute("trigger", new TriggerVO());
        model.addAttribute("packages", installPackageService.getAllPackages());
        return "installPackages/home";
    }


    @RequestMapping(path = {"/edit", "/edit/{id}"})
    public String editInstallPackageById(Model model, @PathVariable("id") Optional<Long> id) throws RecordNotFoundException {
        if (id.isPresent()) {
            InstallPackage installPackageEntity = installPackageService.getUserById(id.get());
            TriggerVO triggerVO = installPackageEntity.getNotifierDescriptor().getTrigger();

            model.addAttribute("trigger", triggerVO);
        } else {
            model.addAttribute("trigger", new TriggerVO());
        }
        return "installPackages/add-installPackage";
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
