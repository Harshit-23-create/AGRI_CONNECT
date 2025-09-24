package com.AgriConnect.SIH.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {

    @Value("${openweathermap.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Fetch current weather + 5-day forecast for given location
     */
    public String getWeatherData(String state, String city, String village) {
        String location = (village != null && !village.isEmpty())
                ? village + "," + city + "," + state
                : city + "," + state;

        try {
            // 1️⃣ Current weather
            String currentUrl = "https://api.openweathermap.org/data/2.5/weather?q="
                    + location + "&units=metric&appid=" + apiKey;
            ResponseEntity<String> currentRes = restTemplate.getForEntity(currentUrl, String.class);

            // 2️⃣ 5-day / 3-hour forecast
            String forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q="
                    + location + "&units=metric&appid=" + apiKey;
            ResponseEntity<String> forecastRes = restTemplate.getForEntity(forecastUrl, String.class);

            // Return combined JSON
            return "{ \"current\":" + currentRes.getBody() + ", \"forecast\":" + forecastRes.getBody() + "}";
        } catch (Exception e) {
            return "{ \"error\": \"Unable to fetch weather data. " + e.getMessage() + "\" }";
        }
    }
}
