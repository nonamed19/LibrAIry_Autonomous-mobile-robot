package com.example.library.domain.user.dto.auth.response;

public class UserLoginResponseDto {

    private int userId;
    private String userName;

    public UserLoginResponseDto() {
    }

    public UserLoginResponseDto(int userId, String userName) {
        this.userId = userId;
        this.userName = userName;
    }

    public int getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }
}
