package com.example.library.domain.robot.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;

@Entity
public class RobotLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "robot_log_id")
    private int robotLogId;
    private int robotLogType;
    private String robotLogContent;
    private LocalDateTime robotLogCreatedAt;
    private LocalDateTime robotLogCompletedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "robot_id")
    private Robot robot;

    public RobotLog() {
    }

    public RobotLog(int robotLogType, String robotLogContent, LocalDateTime robotLogCreatedAt,
        Robot robot) {
        super();
        this.robotLogType = robotLogType;
        this.robotLogContent = robotLogContent;
        this.robotLogCreatedAt = robotLogCreatedAt;
        setRobot(robot);
    }

    public int getRobotLogId() {
        return robotLogId;
    }

    public int getRobotLogType() {
        return robotLogType;
    }

    public void setRobotLogType(int robotLogType) {
        this.robotLogType = robotLogType;
    }

    public String getRobotLogContent() {
        return robotLogContent;
    }

    public void setRobotLogContent(String robotLogContent) {
        this.robotLogContent = robotLogContent;
    }

    public LocalDateTime getRobotLogCreatedAt() {
        return robotLogCreatedAt;
    }

    public void setRobotLogCreatedAt(LocalDateTime robotLogCreatedAt) {
        this.robotLogCreatedAt = robotLogCreatedAt;
    }

    public LocalDateTime getRobotLogCompletedAt() {
        return robotLogCompletedAt;
    }

    public void setRobotLogCompletedAt(LocalDateTime robotLogCompletedAt) {
        this.robotLogCompletedAt = robotLogCompletedAt;
    }

    public Robot getRobot() {
        return robot;
    }

    public void setRobot(Robot robot) {
        this.robot = robot;
        robot.addRobotLog(this);
    }
}
