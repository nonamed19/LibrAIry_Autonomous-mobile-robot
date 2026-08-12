package com.example.library.domain.otp.dto.request;

public class VerifyOtpRequestDto {

    private String userEmail;
    private String certNumber;

    public VerifyOtpRequestDto() {
    }

    public VerifyOtpRequestDto(String userEmail, String certNumber) {
        this.userEmail = userEmail;
        this.certNumber = certNumber;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public String getCertNumber() {
        return certNumber;
    }
}
