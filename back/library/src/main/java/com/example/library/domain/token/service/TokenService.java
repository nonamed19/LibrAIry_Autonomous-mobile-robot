package com.example.library.domain.token.service;

import jakarta.servlet.http.HttpServletResponse;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class TokenService {

    AccessTokenService accessTokenService;
    RefreshTokenService refreshTokenService;

    public TokenService(AccessTokenService accessTokenService,
        RefreshTokenService refreshTokenService) {

        this.accessTokenService = accessTokenService;
        this.refreshTokenService = refreshTokenService;
    }

    public void setTokens(int userId, HttpServletResponse response) {
        String accessToken = accessTokenService.generateAccessToken(userId);

        UUID refreshToken = UUID.randomUUID();
        refreshTokenService.insertRefreshToken(refreshToken, userId);

        response.setHeader("Authorization", "Bearer " + accessToken);
        refreshTokenService.addRefreshTokenToCookie(response, refreshToken);
    }

    public void userLogout(int userId) {
        accessTokenService.addBlackList(userId);
        refreshTokenService.deleteRefreshToken(userId);
    }
}
