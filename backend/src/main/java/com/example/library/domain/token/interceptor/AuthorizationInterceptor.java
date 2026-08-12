package com.example.library.domain.token.interceptor;

import com.example.library.domain.token.service.AccessTokenService;
import com.nimbusds.jwt.JWTClaimsSet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthorizationInterceptor implements HandlerInterceptor {

    private final AccessTokenService accessTokenService;

    public AuthorizationInterceptor(AccessTokenService accessTokenService) {
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

                if (accessTokenService.isValidAuthClaims(claims)) {

                    return true;
                }

                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Administrator access required");
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

