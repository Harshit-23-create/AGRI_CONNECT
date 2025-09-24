package com.AgriConnect.SIH.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LabourAndTool {

    @GetMapping("/LabourAndTools")
    public String LabourAndTools() {
        return "LabourAndToolsTemplate";
    }

}
