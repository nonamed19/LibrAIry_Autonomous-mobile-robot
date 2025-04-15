package com.example.library.domain.book.dto.robot.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BookReturnEndResponseDto {

    @JsonProperty("isDone")
    private boolean isDone;
    private String message;

    public BookReturnEndResponseDto() {
    }

    public BookReturnEndResponseDto(boolean isDone, String message) {
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
