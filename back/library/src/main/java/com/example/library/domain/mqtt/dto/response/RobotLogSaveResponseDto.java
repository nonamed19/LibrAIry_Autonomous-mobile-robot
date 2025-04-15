package com.example.library.domain.mqtt.dto.response;

import com.example.library.domain.mqtt.dto.HardwareDto;
import com.fasterxml.jackson.annotation.JsonProperty;

public class RobotLogSaveResponseDto implements HardwareDto {

    private int robotId;
    @JsonProperty("isDone")
    private boolean isDone;
    private String message;

    public RobotLogSaveResponseDto() {
    }

    public RobotLogSaveResponseDto(int robotId, boolean isDone, String message) {
        this.robotId = robotId;
        this.isDone = isDone;
        this.message = message;
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
