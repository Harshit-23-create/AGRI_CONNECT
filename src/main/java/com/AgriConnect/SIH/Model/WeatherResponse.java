package com.AgriConnect.SIH.Model;

import java.util.List;
import java.util.Map;

public class WeatherResponse {
    private Main main;
    private List<Weather> weather;
    private Wind wind;
    private String name;

    // inner classes
    public static class Main {
        private double temp;
        private int humidity;
        private int pressure;

        // getters and setters
        public double getTemp() { return temp; }
        public void setTemp(double temp) { this.temp = temp; }
        public int getHumidity() { return humidity; }
        public void setHumidity(int humidity) { this.humidity = humidity; }
        public int getPressure() { return pressure; }
        public void setPressure(int pressure) { this.pressure = pressure; }
    }

    public static class Weather {
        private String description;
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class Wind {
        private double speed;
        public double getSpeed() { return speed; }
        public void setSpeed(double speed) { this.speed = speed; }
    }

    // getters and setters
    public Main getMain() { return main; }
    public void setMain(Main main) { this.main = main; }
    public List<Weather> getWeather() { return weather; }
    public void setWeather(List<Weather> weather) { this.weather = weather; }
    public Wind getWind() { return wind; }
    public void setWind(Wind wind) { this.wind = wind; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
