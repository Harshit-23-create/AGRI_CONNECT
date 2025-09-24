package com.AgriConnect.SIH.Model;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileEditModel {
    private String username;      // rename from name → username
    private String serviceProvider; // matches User entity
    private String language;
}


