package com.example.library.domain.book.dto.user.request;

public class BookDeleteRequestDto {

    private String bookId;

    public BookDeleteRequestDto() {
    }

    public BookDeleteRequestDto(String bookId) {
        this.bookId = bookId;
    }

    public String getBookId() {
        return bookId;
    }
}
