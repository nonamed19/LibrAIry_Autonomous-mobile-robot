package com.example.library.domain.robot.dto.request;

public class RobotUpdateRequestDto {

    private int robotId;
    private String robotName;

    public RobotUpdateRequestDto() {
    }

    public RobotUpdateRequestDto(int robotId, String robotName) {
        this.robotId = robotId;
        this.robotName = robotName;
    }

    public int getRobotId() {
        return robotId;
    }

    public String getRobotName() {
        return robotName;
    }
}
