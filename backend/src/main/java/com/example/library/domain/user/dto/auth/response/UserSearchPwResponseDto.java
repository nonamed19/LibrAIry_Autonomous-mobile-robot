package com.example.library.domain.user.dto.auth.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserSearchPwResponseDto {

    @JsonProperty("isDone")
    private boolean isDone;
    private String message;

    public UserSearchPwResponseDto() {
    }

    public UserSearchPwResponseDto(boolean isDone, String message) {
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
