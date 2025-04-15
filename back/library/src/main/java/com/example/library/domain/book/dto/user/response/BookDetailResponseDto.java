package com.example.library.domain.book.dto.user.response;

import java.time.LocalDate;

public class BookDetailResponseDto {

    private String bookId;
    private String bookIsbn;
    private String bookStatus;
    private String bookSign;
    private LocalDate bookReturn;

    public BookDetailResponseDto() {
    }

    public BookDetailResponseDto(String bookId, String bookIsbn, String bookStatus, String bookSign,
        LocalDate bookReturn) {
        this.bookId = bookId;
        this.bookIsbn = bookIsbn;
        this.bookStatus = bookStatus;
        this.bookSign = bookSign;
        this.bookReturn = bookReturn;
    }

    public String getBookId() {
        return bookId;
    }

    public String getBookIsbn() {
        return bookIsbn;
    }

    public String getBookStatus() {
        return bookStatus;
    }

    public String getBookSign() {
        return bookSign;
    }

    public LocalDate getBookReturn() {
        return bookReturn;
    }
}
