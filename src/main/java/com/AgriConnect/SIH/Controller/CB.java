package com.AgriConnect.SIH.Controller;

// import com.AgriConnect.SIH.Model.MarketForm; // Make sure you have this class
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CB {

    @GetMapping("/Chat")
    public String Chat(Model model) {
        return "Chat";
    }

}
