package com.example.library.domain.otp.controller;

import com.example.library.domain.email.service.EmailService;
import com.example.library.domain.otp.dto.request.SendOtpRequestDto;
import com.example.library.domain.otp.dto.request.VerifyOtpRequestDto;
import com.example.library.domain.otp.dto.response.SendOtpResponseDto;
import com.example.library.domain.otp.dto.response.VerifyOtpResponseDto;
import com.example.library.domain.otp.service.OtpService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import java.util.Random;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/otp")
@Tag(name = "otp 도메인 (인증 번호 관련)")
public class OtpController {

    private final OtpService otpService;
    private final EmailService emailService;

    public OtpController(OtpService otpService, EmailService emailService) {
        this.otpService = otpService;
        this.emailService = emailService;
    }

    @Operation(summary = "사용자 회원가입 시 이메일로 인증 번호 발송", description = "사용자가 회원 가입할 때, 이메일 인증 시 사용되는 API 입니다. ")
    @PostMapping("/send")
    public ResponseEntity<SendOtpResponseDto> sendOtp(
        @RequestBody SendOtpRequestDto sendOtpRequestDto) {

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        otpService.saveOtp(sendOtpRequestDto, otp);
        try {
            emailService.sendVerificationEmail(sendOtpRequestDto.getUserEmail(), otp);
        } catch (MessagingException e) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new SendOtpResponseDto(false, "인증 번호 발송 오류!"));
        }
        return ResponseEntity.status(HttpStatus.OK).body(new SendOtpResponseDto(true, "인증 번호 발송!"));
    }

    @Operation(summary = "사용자 회원가입 시 이메일로 보낸 인증 번호 확인", description = "사용자가 회원 가입할 때, 이메일 인증 시 사용되는 API 입니다. ")
    @PostMapping("/verify")
    public ResponseEntity<VerifyOtpResponseDto> verifyOtp(
        @RequestBody VerifyOtpRequestDto verifyOtpRequestDto) {

        boolean isValid = otpService.validateOtp(verifyOtpRequestDto);
        if (isValid) {
            return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(new VerifyOtpResponseDto(true, "인증 성공!"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new VerifyOtpResponseDto(false, "인증 실패!"));
    }
}
