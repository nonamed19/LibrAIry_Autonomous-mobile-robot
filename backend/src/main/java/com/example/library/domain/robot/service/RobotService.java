package com.example.library.domain.robot.service;

import com.example.library.domain.robot.dto.request.RobotDeleteRequestDto;
import com.example.library.domain.robot.dto.request.RobotInsertRequestDto;
import com.example.library.domain.robot.dto.request.RobotUpdateRequestDto;
import com.example.library.domain.robot.dto.response.RobotLogResponseDto;
import com.example.library.domain.robot.dto.response.RobotLogResponseDto.RobotLogDto;
import com.example.library.domain.robot.dto.response.RobotResponseDto;
import com.example.library.domain.robot.dto.response.RobotResponseDto.RobotDto;
import com.example.library.domain.robot.entity.Robot;
import com.example.library.domain.robot.entity.RobotLog;
import com.example.library.domain.robot.entity.RobotStatus;
import com.example.library.domain.robot.repository.RobotRepository;
import jakarta.transaction.Transactional;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
public class RobotService {

    private RobotRepository robotRepository;
    private RobotPhotoService robotPhotoService;

    public RobotService(RobotRepository robotRepository, RobotPhotoService robotPhotoService) {
        this.robotRepository = robotRepository;
        this.robotPhotoService = robotPhotoService;
    }

    public boolean insertRobot(RobotInsertRequestDto robotInsertRequestDto,
        MultipartFile robotImage) {
        if (robotRepository.existsByRobotName(robotInsertRequestDto.getRobotName())) {
            return false;
        }

        Robot newRobot = new Robot(robotInsertRequestDto.getRobotName());

        robotRepository.save(newRobot);
        robotPhotoService.uploadPhoto(newRobot.getRobotId(), robotImage);

        return true;
    }

    public boolean updateRobot(RobotUpdateRequestDto robotUpdateRequestDto,
        MultipartFile robotImage) {
        Robot targetRobot = robotRepository.findById(robotUpdateRequestDto.getRobotId())
            .orElseThrow(() -> new NoSuchElementException("해당 로봇 데이터가 존재하지 않습니다."));

        if (!robotUpdateRequestDto.getRobotName().equals(targetRobot.getRobotName())
            && robotRepository.existsByRobotName(robotUpdateRequestDto.getRobotName())) {
            return false;
        }

        robotPhotoService.uploadPhoto(robotUpdateRequestDto.getRobotId(), robotImage);
        targetRobot.setRobotName(robotUpdateRequestDto.getRobotName());

        return true;
    }

    public void deleteRobot(RobotDeleteRequestDto robotDeleteRequestDto) {
        Robot targetRobot = robotRepository.findById(robotDeleteRequestDto.getRobotId())
            .orElseThrow(() -> new NoSuchElementException("해당 로봇 데이터가 존재하지 않습니다."));

        robotRepository.delete(targetRobot);
    }

    public RobotResponseDto getRobotList() {
        return new RobotResponseDto(
            robotRepository.findAll()
                .stream()
                .map(this::changeToRobotDto)
                .toList()
        );
    }

    private RobotDto changeToRobotDto(Robot robot) {
        return new RobotDto(robot.getRobotId(), robot.getRobotName(),
            robotPhotoService.getRobotPhotoUrl(robot.getRobotId()),
            robot.getRobotStatus());
    }

    public RobotLogResponseDto getRobotLog(int robotId) {
        Robot targetRobot = robotRepository.findById(robotId)
            .orElseThrow(() -> new NoSuchElementException("해당 로봇 데이터가 존재하지 않습니다."));

        return new RobotLogResponseDto(targetRobot.getRobotLogs().stream()
            .map(this::changeToRobotLogDto)
            .toList()
        );
    }

    private RobotLogDto changeToRobotLogDto(RobotLog robotLog) {
        return new RobotLogDto(RobotStatus.values()[robotLog.getRobotLogType()].getStatusDisc()
            , robotLog.getRobotLogContent(), robotLog.getRobotLogCreatedAt(),
            robotLog.getRobotLogCompletedAt());
    }
}
