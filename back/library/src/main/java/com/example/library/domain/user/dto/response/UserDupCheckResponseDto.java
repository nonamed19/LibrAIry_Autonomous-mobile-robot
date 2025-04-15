package com.example.library.domain.user.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserDupCheckResponseDto {

    @JsonProperty("isDone")
    private boolean isDone;
    private String message;

    public UserDupCheckResponseDto() {
    }

    public UserDupCheckResponseDto(boolean isDone, String message) {
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
