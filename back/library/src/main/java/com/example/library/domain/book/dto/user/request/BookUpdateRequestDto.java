package com.example.library.domain.book.dto.user.request;

import io.swagger.v3.oas.annotations.media.Schema;

public class BookUpdateRequestDto {

    private String bookId;
    private String bookIsbn;
    private String bookTitle;
    private String bookWriter;
    private String bookPublisher;
    private int bookStatus;
    private String bookSign;
    private String arriveZoneName;
    @Schema(description = "0이면 등록, 1이면 수정", example = "0")
    private int action;

    public BookUpdateRequestDto() {
    }

    public BookUpdateRequestDto(String bookId, String bookIsbn, String bookTitle,
        String bookWriter, String bookPublisher, int bookStatus, String bookSign,
        String arriveZoneName, int action) {
        this.bookId = bookId;
        this.bookIsbn = bookIsbn;
        this.bookTitle = bookTitle;
        this.bookWriter = bookWriter;
        this.bookPublisher = bookPublisher;
        this.bookStatus = bookStatus;
        this.bookSign = bookSign;
        this.arriveZoneName = arriveZoneName;
        this.action = action;
    }

    public String getBookId() {
        return bookId;
    }

    public String getBookIsbn() {
        return bookIsbn;
    }

    public String getBookTitle() {
        return bookTitle;
    }

    public String getBookWriter() {
        return bookWriter;
    }

    public String getBookPublisher() {
        return bookPublisher;
    }

    public int getBookStatus() {
        return bookStatus;
    }

    public String getBookSign() {
        return bookSign;
    }

    public String getArriveZoneName() {
        return arriveZoneName;
    }

    public int getAction() {
        return action;
    }
}
