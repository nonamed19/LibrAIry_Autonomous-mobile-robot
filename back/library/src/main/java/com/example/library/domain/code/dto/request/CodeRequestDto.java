package com.example.library.domain.code.dto.request;

public class CodeRequestDto {

    private int userId;

    public CodeRequestDto() {
    }

    public CodeRequestDto(int userId) {
        this.userId = userId;
    }

    public int getUserId() {
        return userId;
    }
}
