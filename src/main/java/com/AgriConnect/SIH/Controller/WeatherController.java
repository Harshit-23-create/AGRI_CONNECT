package com.AgriConnect.SIH.Controller;

import com.AgriConnect.SIH.Service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    // Thymeleaf page
    @GetMapping("/WeatherTemplate")
    public String weatherTemplate() {
        return "WeatherTemplate";
    }

    // API endpoint
    @GetMapping("/api/weather")
    @ResponseBody
    public String getWeather(@RequestParam String state,
                             @RequestParam String city,
                             @RequestParam(required = false) String village) {

        return weatherService.getWeatherData(state, city, village);
    }
}
