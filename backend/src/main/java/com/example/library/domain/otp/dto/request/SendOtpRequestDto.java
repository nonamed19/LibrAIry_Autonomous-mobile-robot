package com.example.library.domain.otp.dto.request;

public class SendOtpRequestDto {

    private String userEmail;

    public SendOtpRequestDto() {
    }

    public SendOtpRequestDto(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserEmail() {
        return userEmail;
    }
}
