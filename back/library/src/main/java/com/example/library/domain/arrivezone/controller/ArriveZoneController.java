package com.example.library.domain.arrivezone.controller;

import com.example.library.domain.arrivezone.dto.request.ArriveZoneResetRequestDto;
import com.example.library.domain.arrivezone.dto.response.ArriveZoneResetResponseDto;
import com.example.library.domain.arrivezone.dto.response.ArriveZoneResponseDto;
import com.example.library.domain.arrivezone.service.ArriveZoneService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/arrivezone")
@Tag(name = "arrivezone 도메인")
public class ArriveZoneController {

    ArriveZoneService arriveZoneService;

    public ArriveZoneController(ArriveZoneService arriveZoneService) {
        this.arriveZoneService = arriveZoneService;
    }

    @Operation(summary = "회수 구역 상태 조회", description = "관리자가 회수 현황 배너를 클릭하면 요청되는 API 입니다.")
    @GetMapping("")
    public ResponseEntity<ArriveZoneResponseDto> arriveZoneInfo() {
        return ResponseEntity.status(HttpStatus.OK).body(arriveZoneService.getArriveZoneList());
    }

    @Operation(summary = "회수 구역 상태 리셋", description = "관리자가 회수 구역에서 책을 정리한 이후에 누르는 버튼입니다.")
    @PostMapping("")
    public ResponseEntity<ArriveZoneResetResponseDto> resetArriveZone(
        @RequestBody ArriveZoneResetRequestDto arriveZoneResetRequestDto) {

        arriveZoneService.resetArriveZone(arriveZoneResetRequestDto);
        return ResponseEntity.status(HttpStatus.OK)
            .body(new ArriveZoneResetResponseDto(true, "리셋 완료!"));
    }
}
