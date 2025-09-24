package com.AgriConnect.SIH.Controller;

// import com.AgriConnect.SIH.Model.MarketForm; // Make sure you have this class
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class GovernmentScheme {

    @GetMapping("/GovernmentScheme")
    public String GovernmentScheme(Model model) {
        // Add empty MarketForm object for Thymeleaf th:object
//        model.addAttribute("marketForm", new MarketForm());
        return "GovernmentScheme"; // your template name (MarketPlace.html in templates folder)
    }

}
