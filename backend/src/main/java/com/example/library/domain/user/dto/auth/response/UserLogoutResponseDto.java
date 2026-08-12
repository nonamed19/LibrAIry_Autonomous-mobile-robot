package com.example.library.domain.user.dto.auth.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserLogoutResponseDto {

    @JsonProperty("isDone")
    private boolean isDone;
    private String message;

    public UserLogoutResponseDto() {
    }

    public UserLogoutResponseDto(boolean isDone, String message) {
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
