package com.example.library.domain.user.dto.request;

public class UserRobotRequestDto {

    private int robotId;
    private String userCode;

    public UserRobotRequestDto() {
    }

    public UserRobotRequestDto(int robotId, String userCode) {
        this.robotId = robotId;
        this.userCode = userCode;
    }

    public int getRobotId() {
        return robotId;
    }

    public String getUserCode() {
        return userCode;
    }
}
