package com.example.library.domain.notice.entity;

import com.example.library.domain.robot.entity.Robot;
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
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_id")
    private int noticeId;
    private LocalDateTime noticeCreatedAt;
    private boolean noticeStatus;
    private int noticeType;
    private String noticeContent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "robot_id")
    private Robot robot;

    public Notice() {
    }

    public Notice(LocalDateTime noticeCreatedAt, boolean noticeStatus, int noticeType,
        String noticeContent, Robot robot) {
        this.noticeCreatedAt = noticeCreatedAt;
        this.noticeStatus = noticeStatus;
        this.noticeType = noticeType;
        this.robot = robot;
        this.noticeContent = noticeContent;
        robot.addNotice(this);
    }

    public int getNoticeId() {
        return noticeId;
    }

    public LocalDateTime getNoticeCreatedAt() {
        return noticeCreatedAt;
    }

    public void setNoticeCreatedAt(LocalDateTime noticeCreatedAt) {
        this.noticeCreatedAt = noticeCreatedAt;
    }

    public boolean isNoticeStatus() {
        return noticeStatus;
    }

    public void setNoticeStatus(boolean noticeStatus) {
        this.noticeStatus = noticeStatus;
    }

    public int getNoticeType() {
        return noticeType;
    }

    public void setNoticeType(int noticeType) {
        this.noticeType = noticeType;
    }

    public String getNoticeContent() {
        return noticeContent;
    }

    public void setNoticeContent(String noticeContent) {
        this.noticeContent = noticeContent;
    }

    public Robot getRobot() {
        return robot;
    }

    public void setRobot(Robot robot) {
        this.robot = robot;
    }
}
