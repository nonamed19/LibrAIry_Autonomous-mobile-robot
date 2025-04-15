package com.example.library.domain.book.controller;

import com.example.library.domain.book.dto.robot.request.BookBorrowRequestDto;
import com.example.library.domain.book.dto.robot.request.BookReturnEndRequestDto;
import com.example.library.domain.book.dto.robot.request.BookReturnStartRequestDto;
import com.example.library.domain.book.dto.robot.request.BookRobotRequestDto;
import com.example.library.domain.book.dto.robot.response.BookBorrowResponseDto;
import com.example.library.domain.book.dto.robot.response.BookReturnEndResponseDto;
import com.example.library.domain.book.dto.robot.response.BookReturnStartResponseDto;
import com.example.library.domain.book.dto.robot.response.BookRobotResponseDto;
import com.example.library.domain.book.service.BookConnectService;
import com.example.library.domain.book.service.BookRobotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/book/robot")
@Tag(name = "book/robot 도메인")
public class BookRobotController {

    BookRobotService bookRobotService;
    BookConnectService bookConnectService;

    public BookRobotController(BookRobotService bookRobotService,
        BookConnectService bookConnectService) {
        this.bookRobotService = bookRobotService;
        this.bookConnectService = bookConnectService;
    }

    @Operation(summary = "도서 대출", description = "로봇에서 책을 대출할 때의 API 입니다.")
    @PostMapping("/borrow")
    public ResponseEntity<BookBorrowResponseDto> borrowBook(
        @RequestBody BookBorrowRequestDto bookBorrowRequestDto) {

        bookRobotService.borrowBook(bookBorrowRequestDto);
        return ResponseEntity.status(HttpStatus.OK)
            .body(new BookBorrowResponseDto(true, "대출 성공!"));
    }

    @Operation(summary = "도서 반납/반환 시작", description = "로봇에서 책을 반납 또는 반환 시작시의 API 입니다")
    @PostMapping("/start")
    public ResponseEntity<BookReturnStartResponseDto> returnBookStart(
        @RequestBody BookReturnStartRequestDto bookReturnStartRequestDto) {

        return ResponseEntity.status(HttpStatus.OK)
            .body(bookRobotService.returnBookStart(bookReturnStartRequestDto));
    }

    @Operation(summary = "도서 반납/반환 완료", description = "로봇에서 책을 반납 또는 반환을 완료했을 때의 API 입니다")
    @PostMapping("/end")
    public ResponseEntity<BookReturnEndResponseDto> returnBookEnd(
        @RequestBody BookReturnEndRequestDto bookReturnRequestDto) {

        bookRobotService.returnBookEnd(bookReturnRequestDto);

        return ResponseEntity.status(HttpStatus.OK)
            .body(new BookReturnEndResponseDto(true, "처리 완료!"));
    }

    @Operation(summary = "대출하려는 도서 정보 저장", description = "로봇에서 책을 인식하고 정보를 백엔드에 보내는 API 입니다.")
    @PostMapping("/save")
    public ResponseEntity<BookRobotResponseDto> bookInfoRobot(
        @RequestBody BookRobotRequestDto bookRobotRequestDto) {

        bookConnectService.saveBookInfo(bookRobotRequestDto);
        return ResponseEntity.status(HttpStatus.OK).body(
            new BookRobotResponseDto(true, "저장 성공!")
        );
    }

}
