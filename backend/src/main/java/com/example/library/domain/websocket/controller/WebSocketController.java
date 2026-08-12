package com.example.library.domain.websocket.controller;

import com.example.library.domain.websocket.dto.request.BookSaveRequestDto;
import com.example.library.domain.websocket.dto.request.UserSaveRequestDto;
import com.example.library.domain.websocket.dto.response.BookSaveResponseDto;
import com.example.library.domain.websocket.dto.response.UserSaveResponseDto;
import com.example.library.domain.websocket.service.WebSocketService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    WebSocketService webSocketService;

    public WebSocketController(WebSocketService webSocketService) {
        this.webSocketService = webSocketService;
    }

    public BookSaveResponseDto saveBook(@Payload BookSaveRequestDto bookSaveRequestDto) {
        BookSaveResponseDto bookSaveResponseDto;

        try {
            webSocketService.saveBook(bookSaveRequestDto);
            bookSaveResponseDto = new BookSaveResponseDto(
                bookSaveRequestDto.getRobotId(), true, "책 정보 저장 성공");
        } catch (Exception e) {
            bookSaveResponseDto = new BookSaveResponseDto(
                bookSaveRequestDto.getRobotId(), false, e.getMessage());
        }

        return bookSaveResponseDto;
    }

    public UserSaveResponseDto saveUser(@Payload UserSaveRequestDto userSaveRequestDto) {

        UserSaveResponseDto userSaveResponseDto;

        try {
            webSocketService.saveUser(userSaveRequestDto);
            userSaveResponseDto = new UserSaveResponseDto(
                userSaveRequestDto.getRobotId(), true, "유저 정보 저장 성공");
        } catch (Exception e) {
            userSaveResponseDto = new UserSaveResponseDto(
                userSaveRequestDto.getRobotId(), false, e.getMessage());
        }

        return userSaveResponseDto;
    }

    @MessageMapping("/test")
    @SendTo("/topic/test")
    public String topicTest() {

        return "테스트 통신이에요.";
    }
}