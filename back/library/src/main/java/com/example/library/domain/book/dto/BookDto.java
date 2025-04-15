package com.example.library.domain.book.dto;

import java.time.LocalDate;

public class BookDto {

    private String bookId;
    private String bookIsbn;
    private String bookStatus;
    private String bookSign;
    private LocalDate bookReturn;
    private String arriveZoneName;

    public BookDto() {
    }

    public BookDto(String bookId, String bookIsbn, String bookStatus, String bookSign,
        LocalDate bookReturn,
        String arriveZoneName) {
        this.bookId = bookId;
        this.bookIsbn = bookIsbn;
        this.bookStatus = bookStatus;
        this.bookSign = bookSign;
        this.bookReturn = bookReturn;
        this.arriveZoneName = arriveZoneName;
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

    public String getArriveZoneName() {
        return arriveZoneName;
    }
}
