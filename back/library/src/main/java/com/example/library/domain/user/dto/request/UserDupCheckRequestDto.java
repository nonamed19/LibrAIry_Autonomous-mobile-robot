package com.example.library.domain.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

public class UserDupCheckRequestDto {

    private String targetString;

    @Schema(description = "중복 확인하려는 게 아이디면 0, 이메일이면 1", example = "0")
    private int action;

    public UserDupCheckRequestDto() {
    }

    public UserDupCheckRequestDto(String targetString, int action) {
        this.targetString = targetString;
        this.action = action;
    }

    public String getTargetString() {
        return targetString;
    }

    public int getAction() {
        return action;
    }
}
