package com.AgriConnect.SIH.Service;

import com.AgriConnect.SIH.Entity.User;
import com.AgriConnect.SIH.Model.ProfileEditModel;
import com.AgriConnect.SIH.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfileService {

    private final UserRepository userRepository;

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> getProfileByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User updateProfile(ProfileEditModel model, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(model.getUsername());
        user.setServiceProvider(model.getServiceProvider());
        user.setLanguage(model.getLanguage());

        return userRepository.save(user);
    }

}
