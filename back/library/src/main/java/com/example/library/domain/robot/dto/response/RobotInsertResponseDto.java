package com.example.library.domain.robot.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RobotInsertResponseDto {

    @JsonProperty("isDone")
    private boolean isDone;
    private String message;

    public RobotInsertResponseDto() {
    }

    public RobotInsertResponseDto(boolean isDone, String message) {
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
