package com.example.library.domain.book.dto.user.response;

public class BookFrontResponseDto {

    private String bookId;
    private String bookIsbn;
    private String bookStatus;

    public BookFrontResponseDto() {
    }

    public BookFrontResponseDto(String bookId, String bookIsbn, String bookStatus) {
        this.bookId = bookId;
        this.bookIsbn = bookIsbn;
        this.bookStatus = bookStatus;
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
}
