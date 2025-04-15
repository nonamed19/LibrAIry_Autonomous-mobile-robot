package com.example.library.domain.otp.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class VerifyOtpResponseDto {

    @JsonProperty("isDone")
    private boolean isDone;
    private String message;

    public VerifyOtpResponseDto() {
    }

    public VerifyOtpResponseDto(boolean isDone, String message) {
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
