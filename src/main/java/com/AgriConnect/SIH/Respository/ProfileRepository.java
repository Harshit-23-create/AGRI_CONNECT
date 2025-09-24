package com.AgriConnect.SIH.Repository;

import com.AgriConnect.SIH.Entity.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

@Repository
public class ProfileRepository {
    private final JdbcTemplate jdbc;

    public ProfileRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<User> userRowMapper = new RowMapper<>() {
        @Override
        public User mapRow(ResultSet rs, int rowNum) throws SQLException {
            User u = new User();
            u.setId(rs.getLong("id"));
            u.setUsername(rs.getString("username"));
            u.setEmail(rs.getString("email"));
            u.setServiceProvider(rs.getString("service_provider")); // store Yes/No
            u.setLanguage(rs.getString("language"));
            return u;
        }
    };

    // Fetch user by email
    public Optional<User> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";
        var list = jdbc.query(sql, new Object[]{email}, userRowMapper);
        if (list.isEmpty()) return Optional.empty();
        return Optional.of(list.get(0));
    }

    // Update user profile
    public int updateProfileByEmail(String email, String username, String serviceProvider, String language) {
        String sql = "UPDATE users SET username = ?, service_provider = ?, language = ? WHERE email = ?";
        return jdbc.update(sql, username, serviceProvider, language, email);
    }
}
