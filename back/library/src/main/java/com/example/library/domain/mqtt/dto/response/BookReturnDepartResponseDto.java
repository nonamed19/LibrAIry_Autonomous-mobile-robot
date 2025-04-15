package com.example.library.domain.mqtt.dto.response;

import com.example.library.domain.mqtt.dto.HardwareDto;
import com.fasterxml.jackson.annotation.JsonProperty;

public class BookReturnDepartResponseDto implements HardwareDto {

    private int robotId;
    @JsonProperty("isDone")
    private boolean isDone;
    private double x;
    private double y;
    private double w;

    public BookReturnDepartResponseDto() {
    }

    public BookReturnDepartResponseDto(int robotId, boolean isDone, double x, double y, double w) {
        this.robotId = robotId;
        this.isDone = isDone;
        this.x = x;
        this.y = y;
        this.w = w;
    }

    public int getRobotId() {
        return robotId;
    }

    @JsonProperty("isDone")
    public boolean isDone() {
        return isDone;
    }

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    public double getW() {
        return w;
    }
}
