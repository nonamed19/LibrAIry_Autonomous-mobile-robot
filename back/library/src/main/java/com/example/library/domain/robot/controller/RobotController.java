package com.example.library.domain.robot.controller;

import com.example.library.domain.robot.dto.request.RobotDeleteRequestDto;
import com.example.library.domain.robot.dto.request.RobotInsertRequestDto;
import com.example.library.domain.robot.dto.request.RobotUpdateRequestDto;
import com.example.library.domain.robot.dto.response.RobotDeleteResponseDto;
import com.example.library.domain.robot.dto.response.RobotInsertResponseDto;
import com.example.library.domain.robot.dto.response.RobotLogResponseDto;
import com.example.library.domain.robot.dto.response.RobotResponseDto;
import com.example.library.domain.robot.dto.response.RobotUpdateResponseDto;
import com.example.library.domain.robot.service.RobotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/robot")
@Tag(name = "robot 도메인")
public class RobotController {

    private RobotService robotService;

    public RobotController(RobotService robotService) {
        this.robotService = robotService;
    }

    @Operation(summary = "로봇 리스트 조회", description = "관리자가 로봇 현황 배너를 클릭하면 요청되는 API 입니다.")
    @GetMapping("")
    public ResponseEntity<RobotResponseDto> showRobotList() {

        return ResponseEntity.status(HttpStatus.OK).body(robotService.getRobotList());
    }

    @Operation(summary = "로봇 활동 로그 조회", description = "로봇에서 책을 반납 또는 반환할 때의 API 입니다.")
    @GetMapping("/log")
    public ResponseEntity<RobotLogResponseDto> showRobotLog(@RequestParam int robotId) {

        return ResponseEntity.status(HttpStatus.OK)
            .body(robotService.getRobotLog(robotId));
    }

    @Operation(summary = "로봇 정보 추가", description = "관리자가 로봇을 추가할 때의 API 입니다.")
    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RobotInsertResponseDto> insertRobot(
        @RequestPart RobotInsertRequestDto robotInsertRequestDto,
        @RequestPart MultipartFile robotImage) {

        if (robotService.insertRobot(robotInsertRequestDto, robotImage)) {
            return ResponseEntity.status(HttpStatus.OK)
                .body(new RobotInsertResponseDto(true, "생성 완료!"));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new RobotInsertResponseDto(false, "이미 존재하는 로봇 이름입니다."));
    }

    @Operation(summary = "로봇 정보 수정", description = "관리자가 로봇 정보를 수정할 때의 API 입니다.")
    @PutMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RobotUpdateResponseDto> updateRobot(
        @RequestPart RobotUpdateRequestDto robotUpdateRequestDto,
        @RequestPart MultipartFile robotImage) {

        robotService.updateRobot(robotUpdateRequestDto, robotImage);
        if (robotService.updateRobot(robotUpdateRequestDto, robotImage)) {
            return ResponseEntity.status(HttpStatus.OK)
                .body(new RobotUpdateResponseDto(true, "수정 완료!"));
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new RobotUpdateResponseDto(false, "이미 존재하는 로봇 이름입니다."));
    }

    @Operation(summary = "로봇 정보 삭제", description = "관리자가 로봇 정보를 삭제할 때의 API 입니다.")
    @DeleteMapping("")
    public ResponseEntity<RobotDeleteResponseDto> deleteRobot(
        @RequestBody RobotDeleteRequestDto robotDeleteRequestDto) {

        robotService.deleteRobot(robotDeleteRequestDto);
        return ResponseEntity.status(HttpStatus.OK)
            .body(new RobotDeleteResponseDto(true, "삭제 완료!"));
    }
}
