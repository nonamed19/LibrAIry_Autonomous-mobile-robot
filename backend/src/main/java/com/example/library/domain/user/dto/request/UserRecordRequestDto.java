package com.example.library.domain.user.dto.request;

public class UserRecordRequestDto {

    private int userId;

    public UserRecordRequestDto() {
    }

    public UserRecordRequestDto(int userId) {
        this.userId = userId;
    }

    public int getUserId() {
        return userId;
    }
}
