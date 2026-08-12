package com.example.library.domain.notice.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class NoticeDeleteResponseDto {

    @JsonProperty("isDone")
    private boolean isDone;
    private String message;

    public NoticeDeleteResponseDto() {
    }

    public NoticeDeleteResponseDto(boolean isDone, String message) {
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
