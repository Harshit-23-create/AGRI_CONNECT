package com.AgriConnect.SIH.Repository;

import com.AgriConnect.SIH.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    // This method allows checking if email already exists
    boolean existsByEmail(String email);
}
