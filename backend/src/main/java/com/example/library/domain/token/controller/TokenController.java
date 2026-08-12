package com.example.library.domain.token.controller;

import com.example.library.domain.token.exception.AuthorizationException;
import com.example.library.domain.token.service.AccessTokenService;
import com.example.library.domain.token.service.RefreshTokenService;
import com.example.library.util.BaseResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/token")
@Tag(name = "token 도메인")
public class TokenController {

    AccessTokenService accessTokenService;
    RefreshTokenService refreshTokenService;

    public TokenController(AccessTokenService accessTokenService,
        RefreshTokenService refreshTokenService) {
        this.accessTokenService = accessTokenService;
        this.refreshTokenService = refreshTokenService;
    }

    @Operation(summary = "Access Token 다시 받기",
        description = "Access Token이 만료되었을 때, 클라이언트가 Refresh Token과 함께 요청을 보내서, "
            + "새로운 Access Token을 발급받는 데에 이용되는 API 입니다.")
    @PostMapping("")
    public ResponseEntity<BaseResponseDto> validateRefreshToken(HttpServletRequest request,
        HttpServletResponse response) {

        int userId = accessTokenService.getUserId(request);
        if (!refreshTokenService.validateRefreshToken(request, userId)) {
            refreshTokenService.deleteRefreshToken(userId);
            throw new AuthorizationException("Refresh Token이 유효하지 않습니다.");
        }

        String newAccessToken = accessTokenService.generateAccessToken(userId);

        response.setHeader("Authorization", "Bearer " + newAccessToken);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponseDto(true, "인증 완료!"));
    }
}


