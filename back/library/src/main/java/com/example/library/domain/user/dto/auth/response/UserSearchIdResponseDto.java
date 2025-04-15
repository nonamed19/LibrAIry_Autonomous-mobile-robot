package com.example.library.domain.user.dto.auth.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserSearchIdResponseDto {

    @JsonProperty("isDone")
    private boolean isDone;
    private String message;

    public UserSearchIdResponseDto() {
    }

    public UserSearchIdResponseDto(boolean isDone, String message) {
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
