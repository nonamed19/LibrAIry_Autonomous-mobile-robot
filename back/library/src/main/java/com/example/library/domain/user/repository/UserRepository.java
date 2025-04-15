package com.example.library.domain.user.repository;

import com.example.library.domain.user.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByUserCode(String userCode);

    Optional<User> findByUserEmail(String userEmail);

    Optional<User> findByUserLoginId(String userLoginId);

    boolean existsByUserLoginId(String userLoginId);

    boolean existsByUserEmail(String userEmail);

    boolean existsByUserCode(String userCode);
}
