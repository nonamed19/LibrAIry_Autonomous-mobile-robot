package com.example.library.domain.robot.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class RobotLogResponseDto {

    private List<RobotLogDto> robotLogList;

    public RobotLogResponseDto() {
    }

    public RobotLogResponseDto(List<RobotLogDto> robotLogList) {
        this.robotLogList = robotLogList;
    }

    public List<RobotLogDto> getRobotLogList() {
        return robotLogList;
    }

    public static class RobotLogDto {

        private String robotLogType;
        private String robotLogContent;
        private LocalDateTime robotLogCreatedAt;
        private LocalDateTime robotLogCompletedAt;

        public RobotLogDto() {
        }

        public RobotLogDto(String robotLogType, String robotLogContent,
            LocalDateTime robotLogCreatedAt,
            LocalDateTime robotLogCompletedAt) {
            this.robotLogType = robotLogType;
            this.robotLogContent = robotLogContent;
            this.robotLogCreatedAt = robotLogCreatedAt;
            this.robotLogCompletedAt = robotLogCompletedAt;
        }

        public String getRobotLogType() {
            return robotLogType;
        }

        public String getRobotLogContent() {
            return robotLogContent;
        }

        public LocalDateTime getRobotLogCreatedAt() {
            return robotLogCreatedAt;
        }

        public LocalDateTime getRobotLogCompletedAt() {
            return robotLogCompletedAt;
        }
    }
}
