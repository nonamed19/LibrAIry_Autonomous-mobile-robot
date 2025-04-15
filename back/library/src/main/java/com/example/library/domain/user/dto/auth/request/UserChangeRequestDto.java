package com.example.library.domain.user.dto.auth.request;

import io.swagger.v3.oas.annotations.media.Schema;

public class UserChangeRequestDto {

    private int userId;
    private String userPassword;
    @Schema(description = "비밀번호 재입력인지, 수정인지 재입력이면 0, 수정이면 1", example = "0")
    private int action;

    public UserChangeRequestDto() {
    }

    public UserChangeRequestDto(int userId, String userPassword, int action) {
        this.userId = userId;
        this.userPassword = userPassword;
        this.action = action;
    }

    public int getUserId() {
        return userId;
    }

    public String getUserPassword() {
        return userPassword;
    }

    public int getAction() {
        return action;
    }

}
