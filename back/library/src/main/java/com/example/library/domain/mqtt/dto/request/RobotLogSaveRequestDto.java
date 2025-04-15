package com.example.library.domain.mqtt.dto.request;

public class RobotLogSaveRequestDto {

    private int robotId;
    private String logContent;
    private int sendNotice;

    public RobotLogSaveRequestDto() {
    }

    public RobotLogSaveRequestDto(int robotId, String logContent, int sendNotice) {
        this.robotId = robotId;
        this.logContent = logContent;
        this.sendNotice = sendNotice;
    }

    public int getRobotId() {
        return robotId;
    }

    public String getLogContent() {
        return logContent;
    }

    public int getSendNotice() {
        return sendNotice;
    }
}
