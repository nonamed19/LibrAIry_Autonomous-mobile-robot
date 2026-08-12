package com.example.library.domain.mqtt.service;

import com.example.library.domain.book.dto.robot.request.BookReturnEndRequestDto;
import com.example.library.domain.book.dto.robot.request.BookReturnStartRequestDto;
import com.example.library.domain.book.dto.robot.request.BookRobotRequestDto;
import com.example.library.domain.book.dto.robot.response.BookReturnStartResponseDto;
import com.example.library.domain.book.service.BookConnectService;
import com.example.library.domain.book.service.BookRobotService;
import com.example.library.domain.mqtt.dto.HardwareDto;
import com.example.library.domain.mqtt.dto.request.BookReturnDepartRequestDto;
import com.example.library.domain.mqtt.dto.request.BookReturnFinishRequestDto;
import com.example.library.domain.mqtt.dto.request.BookSaveRequestDto;
import com.example.library.domain.mqtt.dto.request.UserSaveRequestDto;
import com.example.library.domain.mqtt.dto.response.BookReturnDepartResponseDto;
import com.example.library.domain.user.dto.request.UserRobotRequestDto;
import com.example.library.domain.user.service.UserConnectService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
public class MqttService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private MessageChannel mqttOutboundChannel; // MQTT 발행 채널
    private BookConnectService bookConnectService;
    private UserConnectService userConnectService;
    private BookRobotService bookRobotService;

    public MqttService(MessageChannel mqttOutboundChannel, BookConnectService bookConnectService,
        UserConnectService userConnectService, BookRobotService bookRobotService) {
        this.mqttOutboundChannel = mqttOutboundChannel;
        this.bookConnectService = bookConnectService;
        this.userConnectService = userConnectService;
        this.bookRobotService = bookRobotService;
    }

    public void sendMessage(String topic, String payload) {
        Message<String> message = MessageBuilder
            .withPayload(payload)
            .setHeader(MqttHeaders.TOPIC, topic)
            .build();
        mqttOutboundChannel.send(message);
    }

    public String dtoToJson(HardwareDto hardwareDto) throws JsonProcessingException {
        return objectMapper.writeValueAsString(hardwareDto);
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

    public BookReturnDepartResponseDto bookReturnStart(
        BookReturnDepartRequestDto bookReturnDepartRequestDto) {

        BookReturnStartResponseDto bookReturnStartResponseDto =
            bookRobotService.returnBookStart(new BookReturnStartRequestDto(
                bookReturnDepartRequestDto.getBookId(),
                bookReturnDepartRequestDto.getRobotId()
            ));

        return new BookReturnDepartResponseDto(
            bookReturnDepartRequestDto.getRobotId(), true,
            bookReturnStartResponseDto.getLibraryMapX(),
            bookReturnStartResponseDto.getLibraryMapY(),
            bookReturnStartResponseDto.getLibraryMapW()
        );
    }

    public void bookReturnFinish(BookReturnFinishRequestDto bookReturnFinishRequestDto) {
        bookRobotService.returnBookEnd(new BookReturnEndRequestDto(
            bookReturnFinishRequestDto.getBookId(),
            bookReturnFinishRequestDto.getRobotId()
        ));
    }

    public void sendErrorMessage(String payload, String message) {
    }
}
