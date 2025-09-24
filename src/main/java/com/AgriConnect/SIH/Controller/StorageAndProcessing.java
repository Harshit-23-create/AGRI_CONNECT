package com.AgriConnect.SIH.Controller;


import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class StorageAndProcessing {

    @GetMapping("/StorageAndProcessing")
    public String StorageAndProcessing(Model model) {
        // Add empty MarketForm object for Thymeleaf th:object
//        model.addAttribute("marketForm", new MarketForm());
        return "StorageAndProcessing"; // your template name (MarketPlace.html in templates folder)
    }

}
