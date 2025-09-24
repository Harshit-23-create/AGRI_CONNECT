package com.AgriConnect.SIH.Controller;

import com.AgriConnect.SIH.Entity.User;
import com.AgriConnect.SIH.Service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
public class farmerController {

    @Autowired
    private UserService userService;

    // --- Dashboard ---
    @GetMapping("/farmerTemplate")
    public String farmerTemplate(Model model, HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser != null) {
            model.addAttribute("userName", loggedInUser.getUsername());
        }
        return "farmerTemplate";
    }

    // --- Login Page ---
    @GetMapping("/loginPage")
    public String showLoginForm(Model model) {
        model.addAttribute("loginRequest", new User());
        return "fragments/loginPage";
    }

    // --- Login Processing ---
    @PostMapping("/doLogin")
    public String doLogin(@ModelAttribute("loginRequest") User loginRequest,
                          BindingResult result,
                          Model model,
                          HttpSession session) {

        if (result.hasErrors()) return "fragments/loginPage";

        boolean authenticated = userService.authenticate(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        if (authenticated) {
            User user = userService.findByEmail(loginRequest.getEmail());
            session.setAttribute("loggedInUser", user);
            return "redirect:/farmerTemplate";
        } else {
            model.addAttribute("loginError", "Invalid email or password");
            return "fragments/loginPage";
        }
    }

    // --- Registration ---
    @GetMapping("/registerPage")
    public String showRegisterForm(Model model) {
        model.addAttribute("registerRequest", new User());
        return "fragments/registerPage";
    }

    @PostMapping("/doRegister")
    public String doRegister(@ModelAttribute("registerRequest") User user,
                             BindingResult result,
                             Model model) {

        if (result.hasErrors()) return "fragments/registerPage";

        try {
            userService.register(user);
        } catch (Exception e) {
            model.addAttribute("registerError", e.getMessage());
            return "fragments/registerPage";
        }

        return "redirect:/loginPage";
    }

    // --- Logout ---
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/loginPage";
    }
}
