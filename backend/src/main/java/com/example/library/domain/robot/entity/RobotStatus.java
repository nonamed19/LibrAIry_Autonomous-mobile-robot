package com.example.library.domain.robot.entity;

public enum RobotStatus {
    STOP("정지"),
    RETURN("반납/반환"),
    BORROW("대출"),
    NOTICE("알림");

    private final String statusDisc;

    RobotStatus(String statusDisc) {
        this.statusDisc = statusDisc;
    }

    public String getStatusDisc() {
        return this.statusDisc;
    }
}
