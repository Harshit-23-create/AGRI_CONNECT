package com.AgriConnect.SIH.Model;

import java.util.List;

public class State {
    private String name;
    private List<String> cities;

    // Getters and Setters
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public List<String> getCities() {
        return cities;
    }
    public void setCities(List<String> cities) {
        this.cities = cities;
    }
}
