package com.example.library.domain.websocket;

import com.example.library.domain.websocket.controller.WebSocketController;
import com.example.library.domain.websocket.dto.request.BookSaveRequestDto;
import com.example.library.domain.websocket.dto.request.UserSaveRequestDto;
import com.example.library.domain.websocket.dto.response.BookSaveResponseDto;
import com.example.library.domain.websocket.dto.response.UserSaveResponseDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    private ObjectMapper objectMapper = new ObjectMapper();  // JSON 처리

    @Autowired
    private WebSocketController webSocketController;

    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();  // 클라이언트에서 보낸 메시지

        // 메시지 처리 (예: 책 정보 저장 요청)
        if (payload.contains("bookId")) {
            BookSaveRequestDto bookSaveRequestDto = objectMapper.readValue(
                payload, BookSaveRequestDto.class);
            // 실제 비즈니스 로직 수행 (책 저장)
            BookSaveResponseDto bookSaveResponseDto =
                webSocketController.saveBook(bookSaveRequestDto);
            session.sendMessage(
                new TextMessage(objectMapper.writeValueAsString(bookSaveResponseDto)));
        }
        // 메시지 처리 (예: 유저 정보 저장 요청)
        else if (payload.contains("userCode")) {
            UserSaveRequestDto userSaveRequestDto = objectMapper.readValue(
                payload, UserSaveRequestDto.class);
            // 실제 비즈니스 로직 수행 (유저 저장)
            UserSaveResponseDto userSaveResponseDto =
                webSocketController.saveUser(userSaveRequestDto);
            session.sendMessage(
                new TextMessage(objectMapper.writeValueAsString(userSaveResponseDto)));
        }
        // 다른 경우 처리
        else {
            // 특정 메시지 응답 (예: 테스트 메시지)
            session.sendMessage(new TextMessage("테스트 통신이에요."));
        }
    }
}
