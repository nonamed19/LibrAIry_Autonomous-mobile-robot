package com.example.library.domain.notice.controller;

import com.example.library.domain.notice.dto.request.NoticeDeleteRequestDto;
import com.example.library.domain.notice.dto.response.NewNoticeResponseDto;
import com.example.library.domain.notice.dto.response.NoticeDeleteResponseDto;
import com.example.library.domain.notice.dto.response.NoticeResponseDto;
import com.example.library.domain.notice.service.NoticeService;
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
@RequestMapping("/api/notice")
@Tag(name = "notice 도메인")
public class NoticeController {

    NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @Operation(summary = "읽지 않은 알림 개수 조회", description = "읽지 않은 알림이 있는지 관리자 쪽애서 주기적으로 요청하는 API 입니다.")
    @GetMapping("/new")
    public ResponseEntity<NewNoticeResponseDto> checkUnreadNotice() {
        return ResponseEntity.status(HttpStatus.OK).body(noticeService.getUnreadNotice());
    }

    @Operation(summary = "알림 리스트 조회", description = "알림 버튼(종 모양 버튼??)을 눌렀을 때, 알림 목록을 불러오는 API 입니다.")
    @GetMapping("")
    public ResponseEntity<NoticeResponseDto> showNoticeList() {
        return ResponseEntity.status(HttpStatus.OK).body(noticeService.getNoticeList());
    }

    @Operation(summary = "알림 삭제", description = "특정 알림의 삭제 버튼을 누르면 알림이 삭제되는 API 입니다.")
    @PostMapping("")
    public ResponseEntity<NoticeDeleteResponseDto> deleteNotice(
        @RequestBody NoticeDeleteRequestDto noticeDeleteRequestDto) {

        noticeService.deleteNotice(noticeDeleteRequestDto);
        return ResponseEntity.status(HttpStatus.OK)
            .body(new NoticeDeleteResponseDto(true, "삭제 완료!"));

    }
}
