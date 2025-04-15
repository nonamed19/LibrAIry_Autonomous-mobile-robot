package com.example.library.domain.arrivezone.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ArriveZoneResetResponseDto {

    @JsonProperty("isDone")
    private boolean isDone;
    private String message;

    public ArriveZoneResetResponseDto() {
    }

    public ArriveZoneResetResponseDto(boolean isDone, String message) {
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
