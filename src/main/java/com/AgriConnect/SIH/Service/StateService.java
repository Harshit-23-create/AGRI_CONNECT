package com.AgriConnect.SIH.Service;

import com.AgriConnect.SIH.Model.State;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.List;

@Service
public class StateService {

    public List<State> getAllStates() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream inputStream = getClass().getResourceAsStream("/static/data/states.json");
            return mapper.readValue(inputStream, new TypeReference<List<State>>() {});
        } catch (Exception e) {
            throw new RuntimeException("❌ Failed to load states.json: " + e.getMessage(), e);
        }
    }
}
