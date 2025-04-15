package com.example.library.domain.robot.dto.response;

import java.util.List;

public class RobotResponseDto {

    private List<RobotDto> robotList;

    public RobotResponseDto() {
    }

    public RobotResponseDto(List<RobotDto> robotList) {
        this.robotList = robotList;
    }

    public List<RobotDto> getRobotList() {
        return robotList;
    }

    public static class RobotDto {

        private int robotId;
        private String robotName;
        private String robotImageUrl;
        private String robotStatus;

        public RobotDto() {
        }

        public RobotDto(int robotId, String robotName, String robotImageUrl, String robotStatus) {
            this.robotId = robotId;
            this.robotName = robotName;
            this.robotImageUrl = robotImageUrl;
            this.robotStatus = robotStatus;
        }

        public int getRobotId() {
            return robotId;
        }

        public String getRobotName() {
            return robotName;
        }

        public String getRobotImageUrl() {
            return robotImageUrl;
        }

        public String getRobotStatus() {
            return robotStatus;
        }
    }
}
