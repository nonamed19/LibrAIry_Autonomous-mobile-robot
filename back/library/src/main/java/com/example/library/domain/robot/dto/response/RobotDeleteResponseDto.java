package com.example.library.domain.robot.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RobotDeleteResponseDto {

    @JsonProperty("isDone")
    private boolean isDone;
    private String message;

    public RobotDeleteResponseDto() {
    }

    public RobotDeleteResponseDto(boolean isDone, String message) {
        this.isDone = isDone;
        this.message = message;
    }

    @JsonProperty("isDone")
    public boolean isDone() {
        return isDone;
    }

    public String getMessage() {
        return message;
    }
}
