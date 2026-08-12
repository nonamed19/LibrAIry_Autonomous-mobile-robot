package com.example.library.domain.robot.entity;

import com.example.library.domain.notice.entity.Notice;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Entity
public class Robot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "robot_id")
    private int robotId;
    private String robotName;

    @OneToMany(mappedBy = "robot", cascade = CascadeType.REMOVE)
    private List<RobotLog> robotLogs = new ArrayList<>();

    @OneToMany(mappedBy = "robot", cascade = CascadeType.REMOVE)
    private List<Notice> notices = new ArrayList<>();


    public Robot() {
    }

    public Robot(String robotName) {
        this.robotName = robotName;
    }

    public String getRobotName() {
        return robotName;
    }

    public void setRobotName(String robotName) {
        this.robotName = robotName;
    }

    public int getRobotId() {
        return robotId;
    }

    public List<RobotLog> getRobotLogs() {
        return robotLogs;
    }

    public String getRobotStatus() {
        if (robotLogs.size() == 0) {
            return "대기 중";
        }

        RobotLog lastRobotLog = robotLogs.get(robotLogs.size() - 1);
        int lastRobotLogType = lastRobotLog.getRobotLogType();

        if (lastRobotLogType == 0) {
            return "정지";
        }

        if (lastRobotLogType == 2) {
            return "대기 중";
        }

        if (lastRobotLog.getRobotLogCompletedAt() == null) {
            return "작업 중";
        }

        return "대기 중";
    }

    public void addRobotLog(RobotLog robotLog) {
        if (robotLogs.contains(robotLog)) {
            return;
        }

        robotLogs.add(robotLog);
    }

    public void addNotice(Notice notice) {
        if (notices.contains(notice)) {
            return;
        }

        notices.add(notice);
    }

    public void completeLastRobotLog() {
        if (robotLogs.size() == 0) {
            throw new NoSuchElementException("해당 로봇의 로그가 존재하지 않습니다.");
        }

        RobotLog lastRobotLog = robotLogs.get(robotLogs.size() - 1);
        if (lastRobotLog.getRobotLogCompletedAt() != null) {
            throw new NoSuchElementException("이미 완료된 작업입니다.");
        }

        lastRobotLog.setRobotLogCompletedAt(LocalDateTime.now());
    }
}
