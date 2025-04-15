package com.example.library.domain.user.dto.auth.request;

public class UserSearchIdRequestDto {

    private String userEmail;

    public UserSearchIdRequestDto() {
    }

    public UserSearchIdRequestDto(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserEmail() {
        return userEmail;
    }
}
