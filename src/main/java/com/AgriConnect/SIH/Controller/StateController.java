package com.AgriConnect.SIH.Controller;

import com.AgriConnect.SIH.Model.State;
import com.AgriConnect.SIH.Service.StateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class StateController {

    @Autowired
    private StateService stateService;

    // ✅ Thymeleaf view
    @GetMapping("/states")
    public String showStates(Model model) {
        List<State> states = stateService.getAllStates();
        model.addAttribute("states", states);
        return "WeatherTemplate"; // same template you already created
    }

    // ✅ REST API for AJAX
    @GetMapping("/api/states")
    @ResponseBody
    public List<State> getStates() {
        return stateService.getAllStates();
    }
}
