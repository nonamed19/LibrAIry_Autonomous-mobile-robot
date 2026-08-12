package com.example.library.config;

import com.example.library.domain.websocket.WebSocketHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final WebSocketHandler webSocketHandler;
    private final String[] allowedOrigins;

    public WebSocketConfig(WebSocketHandler webSocketHandler,
        @Value("${app.websocket.allowed-origins:https://librairy.p-e.kr,http://localhost:5173}") String[] allowedOrigins) {
        this.webSocketHandler = webSocketHandler;
        this.allowedOrigins = allowedOrigins;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(webSocketHandler, "/ws")
            .setAllowedOriginPatterns(allowedOrigins);
    }
}
