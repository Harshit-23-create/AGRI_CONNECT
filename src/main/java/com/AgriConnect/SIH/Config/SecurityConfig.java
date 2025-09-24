package com.AgriConnect.SIH.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/loginPage", "/doLogin", "/registerPage", "/doRegister", "/css/**", "/js/**").permitAll()
                        .anyRequest().permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")           // URL to trigger logout
                        .logoutSuccessUrl("/farmerTemplate?logout") // redirect after logout
                        .invalidateHttpSession(true)   // clear session
                        .deleteCookies("JSESSIONID")
                );
        return http.build();
    }
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
