package com.example.library.domain.notice.dto.response;

public class NewNoticeResponseDto {

    private int newNoticeNumber;

    public NewNoticeResponseDto() {
    }

    public NewNoticeResponseDto(int newNoticeNumber) {
        this.newNoticeNumber = newNoticeNumber;
    }

    public int getNewNoticeNumber() {
        return newNoticeNumber;
    }
}
