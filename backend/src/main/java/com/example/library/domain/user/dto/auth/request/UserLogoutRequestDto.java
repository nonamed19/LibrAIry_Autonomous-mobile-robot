package com.example.library.domain.user.dto.auth.request;

public class UserLogoutRequestDto {

    private int userId;

    public UserLogoutRequestDto() {
    }

    public UserLogoutRequestDto(int userId) {
        this.userId = userId;
    }

    public int getUserId() {
        return userId;
    }
}
