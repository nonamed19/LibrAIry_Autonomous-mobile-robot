package com.example.library.domain.robot.repository;

import com.example.library.domain.robot.entity.RobotLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RobotLogRepository extends JpaRepository<RobotLog, Integer> {

}
