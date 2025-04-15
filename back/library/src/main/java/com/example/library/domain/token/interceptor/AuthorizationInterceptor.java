package com.example.library.domain.token.interceptor;

import com.example.library.domain.token.service.AccessTokenService;
import com.nimbusds.jwt.JWTClaimsSet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
        Object handler)
        throws Exception {

        String accessToken = accessTokenService.resolveAccessToken(request);
        System.out.println(accessToken);
        if (accessToken != null) {
            try {
                JWTClaimsSet claims = accessTokenService.decryptJWE(accessToken);

                if (accessTokenService.isValidAuthClaims(claims)) {

                    return true;
                }

                throw new Exception("관리자 Access Token이 아닙니다.");
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write(e.getMessage());
                return false;
            }
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("Access token required");
        return false;
    }
}

