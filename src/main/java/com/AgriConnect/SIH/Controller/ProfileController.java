package com.AgriConnect.SIH.Controller;

import com.AgriConnect.SIH.Entity.User;
import com.AgriConnect.SIH.Model.ProfileEditModel;
import com.AgriConnect.SIH.Service.ProfileService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    // --- Show Profile ---
    @GetMapping
    public String showProfile(HttpSession session, Model model) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null) {
            return "redirect:/loginPage"; // redirect if not logged in
        }
        model.addAttribute("user", loggedInUser);
        model.addAttribute("mode", "view"); // view mode
        return "profile";
    }

    // --- Edit Form ---
    @GetMapping("/edit")
    public String editProfileForm(HttpSession session, Model model) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null) return "redirect:/loginPage";

        ProfileEditModel editModel = new ProfileEditModel();
        editModel.setUsername(loggedInUser.getUsername());
        editModel.setServiceProvider(loggedInUser.getServiceProvider());
        editModel.setLanguage(loggedInUser.getLanguage());

        model.addAttribute("editModel", editModel);
        model.addAttribute("user", loggedInUser);
        model.addAttribute("mode", "edit"); // edit mode
        return "profile";
    }

    // --- Update Profile ---
    @PostMapping("/update")
    public String updateProfile(@ModelAttribute ProfileEditModel editModel,
                                HttpSession session,
                                Model model) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null) return "redirect:/loginPage";

        User updatedUser = profileService.updateProfile(editModel, loggedInUser.getEmail());

        // Update session
        session.setAttribute("loggedInUser", updatedUser);

        model.addAttribute("user", updatedUser);
        model.addAttribute("mode", "view"); // show view after update
        model.addAttribute("successMessage", "Profile updated successfully!");
        return "profile";
    }

}
