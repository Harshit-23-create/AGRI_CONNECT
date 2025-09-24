package com.AgriConnect.SIH.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CropRecommendation {

    @GetMapping("/Croprecommendation")
    public String weatherTemplate() {
        return "Croprecommendation";
    }
}
