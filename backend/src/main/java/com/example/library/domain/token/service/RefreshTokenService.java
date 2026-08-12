package com.example.library.domain.token.service;

import com.example.library.util.EncryptKeys;
import com.example.library.util.OpenCrypt;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.Duration;
import java.util.UUID;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class RefreshTokenService {

    private static final String RT_PREFIX = "refresh_token_";

    private final RedisTemplate<String, String> redisTemplate;

    public RefreshTokenService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void insertRefreshToken(UUID refreshToken, int userId) {

        String redisRefreshToken = encryptRefreshToken(refreshToken);

        redisTemplate.opsForValue()
            .set(RT_PREFIX + userId, redisRefreshToken, Duration.ofDays(30));
    }


    public boolean validateRefreshToken(HttpServletRequest request, int userId) {
        String storedRefreshToken = redisTemplate.opsForValue().get(RT_PREFIX + userId);
        UUID refreshToken = resolveRefreshToken(request);

        if (storedRefreshToken == null || refreshToken == null) {
            return false;
        }

        String requestRefreshToken = encryptRefreshToken(refreshToken);

        return storedRefreshToken.equals(requestRefreshToken);
    }

    private String encryptRefreshToken(UUID refreshToken) {
        return OpenCrypt.byteArrayToHex(
            OpenCrypt.getSHA256(refreshToken.toString(), EncryptKeys.getRefreshTokenKey()));
    }

    private UUID resolveRefreshToken(HttpServletRequest request) {
        // Refresh Token은 HttpOnly Cookie로 전달되므로 쿠키에서 추출
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    return UUID.fromString(cookie.getValue());
                }
            }
        }
        return null;
    }

    public void addRefreshTokenToCookie(HttpServletResponse response, UUID newRefreshToken) {
        // HttpOnly Cookie로 refresh token 설정
        Cookie cookie = new Cookie("refreshToken", newRefreshToken.toString());
        cookie.setHttpOnly(true);  // HttpOnly 설정
        cookie.setSecure(true);     // HTTPS 프로토콜을 사용할 때는 Secure 설정
        cookie.setPath("/");       // 경로 설정
        cookie.setMaxAge(60 * 60 * 24 * 30);  // 만료 시간 (예: 30일)// 크로스 도메인 허용
        cookie.setAttribute("SameSite", "None");
        response.addCookie(cookie);
    }

    public void deleteRefreshToken(int userId) {
        redisTemplate.delete(RT_PREFIX + userId);
    }
}
