package com.example.library.domain.token.interceptor;

import com.example.library.domain.token.service.AccessTokenService;
import com.nimbusds.jwt.JWTClaimsSet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
        Object handler)
        throws Exception {

        if (request.getMethod().equalsIgnoreCase("OPTIONS")) {
            return true;
        }// 1. Access Token 추출 및 검증
        
        String accessToken = accessTokenService.resolveAccessToken(request);
        System.out.println(accessToken);
        if (accessToken != null) {
            try {
                JWTClaimsSet claims = accessTokenService.decryptJWE(accessToken);

                // Access Token 유효성 확인
                if (accessTokenService.isValidClaims(claims)) {
                    request.setAttribute("userId", claims.getClaim("userId"));
                    return true; // 유효한 Access Token이므로 요청 진행
                }

                throw new Exception();
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Access token expired");
                return false;
            }
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("Access token required");
        return false;
    }
}
