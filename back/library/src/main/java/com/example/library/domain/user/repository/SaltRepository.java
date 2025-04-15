package com.example.library.domain.user.repository;

import com.example.library.domain.user.entity.Salt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaltRepository extends JpaRepository<Salt, Integer> {

}
