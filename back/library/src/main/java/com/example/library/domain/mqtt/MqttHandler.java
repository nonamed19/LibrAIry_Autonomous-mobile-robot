package com.example.library.domain.mqtt;

import com.example.library.domain.mqtt.controller.MqttController;
import com.example.library.domain.mqtt.dto.request.BookReturnDepartRequestDto;
import com.example.library.domain.mqtt.dto.request.BookReturnFinishRequestDto;
import com.example.library.domain.mqtt.dto.request.BookSaveRequestDto;
import com.example.library.domain.mqtt.dto.request.RobotLogSaveRequestDto;
import com.example.library.domain.mqtt.dto.request.UserSaveRequestDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Component;

@Component
public class MqttHandler {

    private ObjectMapper objectMapper = new ObjectMapper();

    private MqttController mqttController;

    public MqttHandler(MqttController mqttController) {
        this.mqttController = mqttController;
    }

    @ServiceActivator(inputChannel = "mqttInboundChannel")
    public void handleMqttMessage(Message<String> message) {
        String topic = message.getHeaders().get("mqtt_receivedTopic", String.class);
        String payload = message.getPayload();

        try {
            switch (topic) {
                case "topic/book/borrow" -> {
                    BookSaveRequestDto bookSaveRequestDto = objectMapper.readValue(
                        payload, BookSaveRequestDto.class);
                    mqttController.saveBook(bookSaveRequestDto);
                }
                case "topic/user/borrow" -> {
                    UserSaveRequestDto userSaveRequestDto = objectMapper.readValue(
                        payload, UserSaveRequestDto.class);
                    mqttController.saveUser(userSaveRequestDto);
                }
                case "topic/book/return/start" -> {
                    BookReturnDepartRequestDto bookReturnDepartRequestDto = objectMapper.readValue(
                        payload, BookReturnDepartRequestDto.class);
                    mqttController.bookReturnStart(bookReturnDepartRequestDto);
                }
                case "topic/book/return/finish" -> {
                    BookReturnFinishRequestDto bookReturnFinishRequestDto = objectMapper.readValue(
                        payload, BookReturnFinishRequestDto.class);
                    mqttController.bookReturnFinish(bookReturnFinishRequestDto);
                }
                case "topic/log/save" -> {
                    RobotLogSaveRequestDto robotLogSaveRequestDto = objectMapper.readValue(
                        payload, RobotLogSaveRequestDto.class);
                    mqttController.saveRobotLog(robotLogSaveRequestDto);
                }
                default -> mqttController.sendErrorMessage(payload, "등록된 topic이 아니에요.");
            }
        } catch (Exception e) {
            mqttController.sendErrorMessage(payload, "JSON 파싱 에러!");
        }
    }
}
