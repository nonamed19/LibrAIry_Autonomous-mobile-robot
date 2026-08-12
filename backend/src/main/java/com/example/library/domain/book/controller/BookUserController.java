package com.example.library.domain.book.controller;

import com.example.library.domain.book.dto.user.request.BookDeleteRequestDto;
import com.example.library.domain.book.dto.user.request.BookFrontRequestDto;
import com.example.library.domain.book.dto.user.request.BookUpdateRequestDto;
import com.example.library.domain.book.dto.user.response.BookDeleteResponseDto;
import com.example.library.domain.book.dto.user.response.BookDetailResponseDto;
import com.example.library.domain.book.dto.user.response.BookFrontResponseDto;
import com.example.library.domain.book.dto.user.response.BookMostListResponseDto;
import com.example.library.domain.book.dto.user.response.BookSearchResponseDto;
import com.example.library.domain.book.dto.user.response.BookUpdateResponseDto;
import com.example.library.domain.book.service.BookConnectService;
import com.example.library.domain.book.service.BookRankService;
import com.example.library.domain.book.service.BookUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/book/user")
@Tag(name = "book/user 도메인")
public class BookUserController {

    BookUserService bookUserService;
    BookRankService bookRankService;
    BookConnectService bookConnectService;

    public BookUserController(BookUserService bookUserService,
        BookRankService bookRankService, BookConnectService bookConnectService) {
        this.bookUserService = bookUserService;
        this.bookRankService = bookRankService;
        this.bookConnectService = bookConnectService;
    }


    @Operation(summary = "대출하려는 도서 정보 요청", description = "프론트에서 저장된 책 정보를 요청하는 API 입니다.")
    @PostMapping("/front")
    public ResponseEntity<BookFrontResponseDto> bookInfoFront(
        @RequestBody BookFrontRequestDto bookFrontRequestDto) {

        return ResponseEntity.status(HttpStatus.OK)
            .body(bookConnectService.getBookInfo(bookFrontRequestDto));
    }

    @Operation(summary = "도서 검색",
        description = "사용자 또는 관리자가 도서 검색을 할 때의 API 입니다.\n\naction: 0: 제목, 1: 작가, 2: 출판사, 3:RFID")
    @GetMapping("/search")
    public ResponseEntity<BookSearchResponseDto> searchBook(
        @RequestParam String searchString, @RequestParam int action) {

        return ResponseEntity.status(HttpStatus.OK)
            .body(bookUserService.searchBook(searchString, action));
    }

    @Operation(summary = "주간/월간 대출 순위 리스트",
        description = "사용자 화면에서 주간/월간 대출 리스트를 띄워줄 때 사용되는 API 입니다. \n\naction: 0이면 주간, 1이면 월간")
    @GetMapping("/most")
    public ResponseEntity<BookMostListResponseDto> bookMost(
        @RequestParam int action) {

        return ResponseEntity.status(HttpStatus.OK).body(bookRankService.getBookMostList(action));
    }

    @Operation(summary = "도서 등록/도서 정보 수정",
        description = "관리자가 도서관에 책 정보를 등록/수정할 때 사용되는 API 입니다\n\naction: 0이면 등록, 1이면 수정")
    @PostMapping("")
    public ResponseEntity<BookUpdateResponseDto> updateBook(
        @RequestBody BookUpdateRequestDto bookUpdateRequestDto) {

        if (bookUpdateRequestDto.getAction() == 0) {
            bookUserService.insertBook(bookUpdateRequestDto);
        }

        if (bookUpdateRequestDto.getAction() == 1) {
            bookUserService.updateBook(bookUpdateRequestDto);
        }

        return ResponseEntity.status(HttpStatus.OK)
            .body(new BookUpdateResponseDto(true, "등록/수정 완료!"));
    }

    @Operation(summary = "도서 상세 정보", description = "사용자가 도서를 클릭하면 상세 정보를 제공해주는 API 입니다.")
    @GetMapping("/detail")
    public ResponseEntity<BookDetailResponseDto> getBookDetail(@RequestParam String bookId) {

        return ResponseEntity.status(HttpStatus.OK).body(bookUserService.getBookDetail(bookId));
    }

    @Operation(summary = "도서 삭제", description = "관리자가 도서관의 책 정보를 삭제할 때 이용하는 API 입니다.")
    @DeleteMapping("")
    public ResponseEntity<BookDeleteResponseDto> deleteBook(
        @RequestBody BookDeleteRequestDto bookDeleteRequestDto) {

        bookUserService.deleteBook(bookDeleteRequestDto);
        return ResponseEntity.status(HttpStatus.OK)
            .body(new BookDeleteResponseDto(true, "삭제 완료!"));
    }
}
