package com.example.library.domain.user.dto.response;

public class UserFrontResponseDto {

    private int userId;
    private String userName;
    private String userStatus;

    public UserFrontResponseDto() {
    }

    public UserFrontResponseDto(int userId, String userName, String userStatus) {
        this.userId = userId;
        this.userName = userName;
        this.userStatus = userStatus;
    }

    public int getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }

    public String getUserStatus() {
        return userStatus;
    }
}
