package com.AgriConnect.SIH.Service;

import com.AgriConnect.SIH.Entity.User;
import com.AgriConnect.SIH.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Register new user
    public User register(User user) throws Exception {
        if(userRepository.existsByEmail(user.getEmail())) {
            throw new Exception("Email already registered");
        }

        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    // Authenticate user by email and password
    public boolean authenticate(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if(userOpt.isPresent()) {
            return passwordEncoder.matches(password, userOpt.get().getPassword());
        }
        return false;
    }

    // Find user by email
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}
