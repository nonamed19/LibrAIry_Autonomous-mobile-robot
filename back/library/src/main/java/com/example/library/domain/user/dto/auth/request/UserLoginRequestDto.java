package com.example.library.domain.user.dto.auth.request;

public class UserLoginRequestDto {

    private String userLoginId;
    private String userPassword;

    public UserLoginRequestDto() {
    }

    public UserLoginRequestDto(String userLoginId, String userPassword) {
        this.userLoginId = userLoginId;
        this.userPassword = userPassword;
    }

    public String getUserLoginId() {
        return userLoginId;
    }

    public String getUserPassword() {
        return userPassword;
    }
}
