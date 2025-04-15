package com.example.library.domain.robot.dto.request;

public class RobotInsertRequestDto {

    private String robotName;

    public RobotInsertRequestDto() {
    }

    public RobotInsertRequestDto(String robotName) {
        this.robotName = robotName;
    }

    public String getRobotName() {
        return robotName;
    }
}
