package com.example.library.domain.websocket.service;

import com.example.library.domain.book.dto.robot.request.BookRobotRequestDto;
import com.example.library.domain.book.service.BookConnectService;
import com.example.library.domain.user.dto.request.UserRobotRequestDto;
import com.example.library.domain.user.service.UserConnectService;
import com.example.library.domain.websocket.dto.request.BookSaveRequestDto;
import com.example.library.domain.websocket.dto.request.UserSaveRequestDto;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class WebSocketService {

    private BookConnectService bookConnectService;
    private UserConnectService userConnectService;

    public WebSocketService(BookConnectService bookConnectService,
        UserConnectService userConnectService) {
        this.bookConnectService = bookConnectService;
        this.userConnectService = userConnectService;
    }

    public void saveBook(BookSaveRequestDto bookSaveRequestDto) {
        bookConnectService.saveBookInfo(
            new BookRobotRequestDto(bookSaveRequestDto.getRobotId(), bookSaveRequestDto.getBookId())
        );
    }

    public void saveUser(UserSaveRequestDto userSaveRequestDto) {
        userConnectService.saveUserInfo(
            new UserRobotRequestDto(userSaveRequestDto.getRobotId(),
                userSaveRequestDto.getUserCode())
        );
    }
}
