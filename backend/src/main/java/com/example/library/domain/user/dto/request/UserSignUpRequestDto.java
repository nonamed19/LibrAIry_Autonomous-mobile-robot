package com.example.library.domain.user.dto.request;

import java.time.LocalDate;

public class UserSignUpRequestDto {

    private String userLoginId;
    private String userPassword;
    private String userName;
    private String userEmail;
    private LocalDate userBirth;

    public UserSignUpRequestDto() {
    }

    public UserSignUpRequestDto(String userLoginId, String userPassword, String userName,
        String userEmail,
        LocalDate userBirth) {
        this.userLoginId = userLoginId;
        this.userPassword = userPassword;
        this.userName = userName;
        this.userEmail = userEmail;
        this.userBirth = userBirth;
    }

    public String getUserLoginId() {
        return userLoginId;
    }

    public String getUserPassword() {
        return userPassword;
    }

    public String getUserName() {
        return userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public LocalDate getUserBirth() {
        return userBirth;
    }
}
