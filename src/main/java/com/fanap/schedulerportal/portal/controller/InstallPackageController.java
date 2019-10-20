package com.fanap.schedulerportal.portal.controller;

import com.fanap.schedulerportal.portal.entities.InstallPackage;
import com.fanap.schedulerportal.portal.repository.InstallPackageRepository;
import com.fanap.schedulerportal.portal.service.InstallPackageService;
import com.fanap.schedulerportal.portal.service.PluginModuleService;
import net.lingala.zip4j.core.ZipFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.io.File;
import java.util.Iterator;

@Controller
@RequestMapping("/")
public class InstallPackageController {
    @Autowired
    private InstallPackageService installPackageService;
    @Autowired
    protected PluginModuleService pluginModuleService;

    @PostMapping("/")
    public String createInstallPackage(@RequestParam("file") MultipartFile file ,RedirectAttributes redirectAttributes) {
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

        return "installPackages/add-installPackage";
    }

    @RequestMapping
    public String homeInstallPackageController() {
        return "installPackages/home";
    }



}
