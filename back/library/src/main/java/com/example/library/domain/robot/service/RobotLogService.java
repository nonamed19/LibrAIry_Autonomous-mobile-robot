package com.example.library.domain.robot.service;

import com.example.library.domain.mqtt.dto.request.RobotLogSaveRequestDto;
import com.example.library.domain.notice.entity.Notice;
import com.example.library.domain.notice.repository.NoticeRepository;
import com.example.library.domain.robot.entity.Robot;
import com.example.library.domain.robot.entity.RobotLog;
import com.example.library.domain.robot.repository.RobotLogRepository;
import com.example.library.domain.robot.repository.RobotRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class RobotLogService {

    RobotRepository robotRepository;
    RobotLogRepository robotLogRepository;
    NoticeRepository noticeRepository;

    public RobotLogService(RobotRepository robotRepository, RobotLogRepository robotLogRepository,
        NoticeRepository noticeRepository) {
        this.robotRepository = robotRepository;
        this.robotLogRepository = robotLogRepository;
        this.noticeRepository = noticeRepository;
    }

    public void saveRobotLog(RobotLogSaveRequestDto robotLogSaveRequestDto) {
        Robot targetRobot = robotRepository.findById(robotLogSaveRequestDto.getRobotId())
            .orElseThrow(() -> new NoSuchElementException("해당 로봇이 존재하지 않습니다!"));

        RobotLog newRobotLog = new RobotLog(
            3, robotLogSaveRequestDto.getLogContent(), LocalDateTime.now(), targetRobot);
        newRobotLog.setRobotLogCompletedAt(LocalDateTime.now());

        robotLogRepository.save(newRobotLog);

        if (robotLogSaveRequestDto.getSendNotice() == 1) {
            Notice newNotice = new Notice(
                LocalDateTime.now(), true, 3,
                "로봇 " + targetRobot.getRobotName() + " : " + robotLogSaveRequestDto.getLogContent(),
                targetRobot);

            noticeRepository.save(newNotice);
        }
    }
}
