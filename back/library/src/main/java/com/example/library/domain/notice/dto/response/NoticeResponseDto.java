package com.example.library.domain.notice.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class NoticeResponseDto {

    private List<NoticeDto> noticeList;

    public NoticeResponseDto() {

    }

    public NoticeResponseDto(List<NoticeDto> noticeList) {
        this.noticeList = noticeList;
    }

    public List<NoticeDto> getNoticeList() {
        return noticeList;
    }

    public static class NoticeDto {

        private int noticeId;
        private LocalDateTime noticeCreatedAt;
        private boolean noticeStatus;
        private String noticeType;
        private String noticeContent;
        private int robotId;

        public NoticeDto() {
        }

        public NoticeDto(int noticeId, LocalDateTime noticeCreatedAt, boolean noticeStatus,
            String noticeType, String noticeContent, int robotId) {
            this.noticeId = noticeId;
            this.noticeCreatedAt = noticeCreatedAt;
            this.noticeStatus = noticeStatus;
            this.noticeType = noticeType;
            this.noticeContent = noticeContent;
            this.robotId = robotId;
        }

        public int getNoticeId() {
            return noticeId;
        }

        public LocalDateTime getNoticeCreatedAt() {
            return noticeCreatedAt;
        }

        public boolean isNoticeStatus() {
            return noticeStatus;
        }

        public String getNoticeType() {
            return noticeType;
        }

        public String getNoticeContent() {
            return noticeContent;
        }

        public int getRobotId() {
            return robotId;
        }
    }
}
