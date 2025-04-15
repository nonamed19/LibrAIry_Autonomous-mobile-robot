package com.example.library.domain.otp.service;

import com.example.library.domain.otp.dto.request.SendOtpRequestDto;
import com.example.library.domain.otp.dto.request.VerifyOtpRequestDto;
import java.time.Duration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class OtpService {

    private final RedisTemplate<String, String> redisTemplate;

    public OtpService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // OTP 저장 (5분 TTL)
    public void saveOtp(SendOtpRequestDto sendOtpRequestDto, String otp) {
        redisTemplate.opsForValue()
            .set(sendOtpRequestDto.getUserEmail(), otp, Duration.ofMinutes(5));
    }

    //OTP 검증

    public boolean validateOtp(VerifyOtpRequestDto verifyOtpRequestDto) {
        String storedOtp = redisTemplate.opsForValue().get(verifyOtpRequestDto.getUserEmail());
        if (storedOtp != null && storedOtp.equals(verifyOtpRequestDto.getCertNumber())) {
            return true;
        }
        return false;
    }
}