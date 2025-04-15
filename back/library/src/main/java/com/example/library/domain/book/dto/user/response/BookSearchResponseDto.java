package com.example.library.domain.book.dto.user.response;

import com.example.library.domain.book.dto.BookDto;
import java.util.List;

public class BookSearchResponseDto {

    private List<BookDto> bookList;

    public BookSearchResponseDto() {
    }

    public BookSearchResponseDto(List<BookDto> bookList) {
        this.bookList = bookList;
    }

    public List<BookDto> getBookList() {
        return bookList;
    }
}
