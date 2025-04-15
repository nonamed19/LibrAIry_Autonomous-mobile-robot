package com.example.library.domain.user.dto.request;

public class UserLeaveRequestDto {

    private int userId;

    public UserLeaveRequestDto() {
    }

    public UserLeaveRequestDto(int userId) {
        this.userId = userId;
    }

    public int getUserId() {
        return userId;
    }
}
