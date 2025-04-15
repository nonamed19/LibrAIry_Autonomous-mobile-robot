package com.example.library.domain.mqtt.dto.request;

public class UserSaveRequestDto {

    private int robotId;
    private String userCode;

    public UserSaveRequestDto() {
    }

    public UserSaveRequestDto(int robotId, String userCode) {
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
