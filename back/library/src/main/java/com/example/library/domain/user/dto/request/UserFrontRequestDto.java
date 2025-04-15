package com.example.library.domain.user.dto.request;

public class UserFrontRequestDto {

    private int robotId;

    public UserFrontRequestDto() {
    }

    public UserFrontRequestDto(int robotId) {
        this.robotId = robotId;
    }

    public int getRobotId() {
        return robotId;
    }
}
