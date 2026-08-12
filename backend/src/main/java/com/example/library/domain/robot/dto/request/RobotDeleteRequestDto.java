package com.example.library.domain.robot.dto.request;

public class RobotDeleteRequestDto {

    private int robotId;

    public RobotDeleteRequestDto() {
    }

    public RobotDeleteRequestDto(int robotId) {
        this.robotId = robotId;
    }

    public int getRobotId() {
        return robotId;
    }
}
