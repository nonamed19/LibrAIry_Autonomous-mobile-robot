package com.example.library.domain.user.dto.auth.request;

import java.time.LocalDate;

public class UserSearchPwRequestDto {

    private String userLoginId;
    private LocalDate userBirth;

    public UserSearchPwRequestDto() {
    }

    public UserSearchPwRequestDto(String userLoginId, LocalDate userBirth) {
        this.userLoginId = userLoginId;
        this.userBirth = userBirth;
    }

    public String getUserLoginId() {
        return userLoginId;
    }

    public LocalDate getUserBirth() {
        return userBirth;
    }
}
