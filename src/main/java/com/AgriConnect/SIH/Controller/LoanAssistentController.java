package com.AgriConnect.SIH.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoanAssistentController {
    @GetMapping("/LoanAssistent")
    public String LoanAssistent() {
        return "LoanAssistent";
    }
}
