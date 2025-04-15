package com.example.library.domain.notice.dto.request;

public class NoticeDeleteRequestDto {

    private int noticeId;

    public NoticeDeleteRequestDto() {
    }

    public NoticeDeleteRequestDto(int noticeId) {
        this.noticeId = noticeId;
    }

    public int getNoticeId() {
        return noticeId;
    }
}
