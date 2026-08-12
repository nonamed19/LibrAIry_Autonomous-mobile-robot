package com.example.library.domain.book.dto.user.request;

import io.swagger.v3.oas.annotations.media.Schema;

public class BookSearchRequestDto {

    private String searchValue;
    @Schema(description = "검색 기준, 0: 제목, 1: 작가, 2: 출판사, 3: 바코드", example = "0")
    private int action;

    public BookSearchRequestDto() {
    }

    public BookSearchRequestDto(String searchValue, int action) {
        this.searchValue = searchValue;
        this.action = action;
    }

    public String getSearchValue() {
        return searchValue;
    }

    public int getAction() {
        return action;
    }
}
