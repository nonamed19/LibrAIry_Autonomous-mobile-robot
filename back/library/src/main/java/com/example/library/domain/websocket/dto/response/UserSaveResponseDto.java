package com.example.library.domain.websocket.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserSaveResponseDto {

    private int robotId;
    @JsonProperty("isDone")
    private boolean isDone;
    private String message;

    public UserSaveResponseDto() {
    }

    public UserSaveResponseDto(int robotId, boolean isDone, String message) {
        this.isDone = isDone;
        this.message = message;
        this.robotId = robotId;
    }

    public int getRobotId() {
        return robotId;
    }

    @JsonProperty("isDone")
    public boolean isDone() {
        return isDone;
    }

    public String getMessage() {
        return message;
    }
}
