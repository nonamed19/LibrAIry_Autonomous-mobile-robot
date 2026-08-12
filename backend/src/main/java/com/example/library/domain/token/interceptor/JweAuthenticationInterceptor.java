package com.example.library.domain.token.interceptor;

import com.example.library.domain.token.service.AccessTokenService;
import com.nimbusds.jwt.JWTClaimsSet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class JweAuthenticationInterceptor implements HandlerInterceptor {

    private final AccessTokenService accessTokenService;

    public JweAuthenticationInterceptor(AccessTokenService accessTokenService) {
        this.accessTokenService = accessTokenService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
        Object handler) throws IOException {

        if (request.getMethod().equalsIgnoreCase("OPTIONS")) {
            return true;
        }

        String accessToken = accessTokenService.resolveAccessToken(request);
        if (accessToken != null) {
            try {
                JWTClaimsSet claims = accessTokenService.decryptJWE(accessToken);

                // Access Token 유효성 확인
                if (accessTokenService.isValidClaims(claims)) {
                    request.setAttribute("userId", claims.getClaim("userId"));
                    return true; // 유효한 Access Token이므로 요청 진행
                }

                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid access token");
                return false;
            } catch (Exception e) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid access token");
                return false;
            }
        }

        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Access token required");
        return false;
    }
}
