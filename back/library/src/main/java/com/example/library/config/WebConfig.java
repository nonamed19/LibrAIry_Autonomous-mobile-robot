package com.example.library.config;

import com.example.library.domain.token.interceptor.AuthorizationInterceptor;
import com.example.library.domain.token.interceptor.JweAuthenticationInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final JweAuthenticationInterceptor jweAuthenticationInterceptor;
    private final AuthorizationInterceptor authorizationInterceptor;

    public WebConfig(JweAuthenticationInterceptor jweAuthenticationInterceptor,
        AuthorizationInterceptor authorizationInterceptor) {
        this.jweAuthenticationInterceptor = jweAuthenticationInterceptor;
        this.authorizationInterceptor = authorizationInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(jweAuthenticationInterceptor)
            .addPathPatterns("/api/user/search")
            .addPathPatterns("/api/user/leave")
            .addPathPatterns("/api/code")
            .addPathPatterns("/api/user/auth/logout");
    }
//
//        registry.addInterceptor(authorizationInterceptor)
//            .addPathPatterns("/api/robot/**")
//            .addPathPatterns("/api/notice/**")
//            .addPathPatterns("/api/book/user")
//            .addPathPatterns("/api/arrivezone/**");
//    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {

        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // 모든 API 경로에 대해 적용
                    .allowedOriginPatterns("http://localhost:3000",
                        "http://70.12.246.33:3000",
                        "https://*.vercel.app",
                        "https://librairy.p-e.kr") // 허용할 프론트엔드 도메인
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .exposedHeaders("Authorization")// 허용할 HTTP 메서드
                    .allowCredentials(true); // 쿠키 포함 여부
            }
        };
    }
}
