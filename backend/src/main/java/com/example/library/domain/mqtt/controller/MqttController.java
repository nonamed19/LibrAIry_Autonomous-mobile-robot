package com.example.library.domain.mqtt.controller;

import com.example.library.domain.mqtt.dto.request.BookReturnDepartRequestDto;
import com.example.library.domain.mqtt.dto.request.BookReturnFinishRequestDto;
import com.example.library.domain.mqtt.dto.request.BookSaveRequestDto;
import com.example.library.domain.mqtt.dto.request.RobotLogSaveRequestDto;
import com.example.library.domain.mqtt.dto.request.UserSaveRequestDto;
import com.example.library.domain.mqtt.dto.response.BookReturnDepartResponseDto;
import com.example.library.domain.mqtt.dto.response.BookReturnFinishResponseDto;
import com.example.library.domain.mqtt.dto.response.BookSaveResponseDto;
import com.example.library.domain.mqtt.dto.response.RobotLogSaveResponseDto;
import com.example.library.domain.mqtt.dto.response.UserSaveResponseDto;
import com.example.library.domain.mqtt.service.MqttService;
import com.example.library.domain.robot.service.RobotLogService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.stereotype.Controller;

@Controller
public class MqttController {

    private MqttService mqttService;
    private RobotLogService robotLogService;

    public MqttController(MqttService mqttService, RobotLogService robotLogService) {
        this.mqttService = mqttService;
        this.robotLogService = robotLogService;
    }

    public void saveBook(BookSaveRequestDto bookSaveRequestDto) throws JsonProcessingException {
        BookSaveResponseDto bookSaveResponseDto;

        try {
            mqttService.saveBook(bookSaveRequestDto);
            bookSaveResponseDto = new BookSaveResponseDto(
                bookSaveRequestDto.getRobotId(), true, "책 정보 저장 성공");
        } catch (Exception e) {
            bookSaveResponseDto = new BookSaveResponseDto(
                bookSaveRequestDto.getRobotId(), false, e.getMessage());
        }

        mqttService.sendMessage(
            "queue/book/borrow/" + bookSaveRequestDto.getRobotId()
            , mqttService.dtoToJson(bookSaveResponseDto));
    }

    public void saveUser(UserSaveRequestDto userSaveRequestDto) throws JsonProcessingException {
        UserSaveResponseDto userSaveResponseDto;

        try {
            mqttService.saveUser(userSaveRequestDto);
            userSaveResponseDto = new UserSaveResponseDto(
                userSaveRequestDto.getRobotId(), true, "유저 정보 저장 성공");
        } catch (Exception e) {
            userSaveResponseDto = new UserSaveResponseDto(
                userSaveRequestDto.getRobotId(), false, e.getMessage());
        }

        mqttService.sendMessage(
            "queue/user/borrow/" + userSaveRequestDto.getRobotId()
            , mqttService.dtoToJson(userSaveResponseDto));
    }

    public void bookReturnStart(BookReturnDepartRequestDto bookReturnDepartRequestDto)
        throws JsonProcessingException {
        BookReturnDepartResponseDto bookReturnStartResponseDto;

        try {
            mqttService.bookReturnStart(bookReturnDepartRequestDto);
            bookReturnStartResponseDto = mqttService.bookReturnStart(bookReturnDepartRequestDto);
        } catch (Exception e) {
            bookReturnStartResponseDto = new BookReturnDepartResponseDto(
                bookReturnDepartRequestDto.getRobotId(), false, -1, -1, -1);
        }

        mqttService.sendMessage(
            "queue/book/return/start/" + bookReturnDepartRequestDto.getRobotId()
            , mqttService.dtoToJson(bookReturnStartResponseDto));
    }

    public void bookReturnFinish(BookReturnFinishRequestDto bookReturnFinishRequestDto)
        throws JsonProcessingException {

        BookReturnFinishResponseDto bookReturnFinishResponseDto;

        try {
            mqttService.bookReturnFinish(bookReturnFinishRequestDto);
            bookReturnFinishResponseDto = new BookReturnFinishResponseDto(
                bookReturnFinishRequestDto.getRobotId(), true, "반납/반환 처리 완료!"
            );
        } catch (Exception e) {
            bookReturnFinishResponseDto = new BookReturnFinishResponseDto(
                bookReturnFinishRequestDto.getRobotId(), false, e.getMessage()
            );
        }

        mqttService.sendMessage(
            "queue/book/return/finish/" + bookReturnFinishRequestDto.getRobotId()
            , mqttService.dtoToJson(bookReturnFinishResponseDto));
    }

    public void saveRobotLog(RobotLogSaveRequestDto robotLogSaveRequestDto)
        throws JsonProcessingException {

        RobotLogSaveResponseDto robotLogSaveResponseDto;

        try {
            robotLogService.saveRobotLog(robotLogSaveRequestDto);
            robotLogSaveResponseDto = new RobotLogSaveResponseDto(
                robotLogSaveRequestDto.getRobotId(), true, "로그 저장 완료!"
            );
        } catch (Exception e) {
            robotLogSaveResponseDto = new RobotLogSaveResponseDto(
                robotLogSaveRequestDto.getRobotId(), false, e.getMessage()
            );
        }

        mqttService.sendMessage(
            "queue/log/save/" + robotLogSaveRequestDto.getRobotId()
            , mqttService.dtoToJson(robotLogSaveResponseDto));
    }


    public void sendErrorMessage(String payload, String message) {
        mqttService.sendErrorMessage(payload, message);
    }
}
