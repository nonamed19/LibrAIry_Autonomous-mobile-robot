package com.example.library.util;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BaseResponseDto {

    @JsonProperty("isDone")
    private boolean isDone;
    private String message;

    public BaseResponseDto() {
    }

    public BaseResponseDto(boolean isDone, String message) {
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
