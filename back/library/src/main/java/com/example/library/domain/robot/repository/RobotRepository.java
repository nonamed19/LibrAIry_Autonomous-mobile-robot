package com.example.library.domain.robot.repository;

import com.example.library.domain.robot.entity.Robot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RobotRepository extends JpaRepository<Robot, Integer> {

    boolean existsByRobotName(String robotName);
}
