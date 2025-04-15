package com.example.library.domain.book.dto.user.request;

public class BookFrontRequestDto {

    private int robotId;

    public BookFrontRequestDto() {
    }

    public BookFrontRequestDto(int robotId) {
        this.robotId = robotId;
    }

    public int getRobotId() {
        return robotId;
    }
}
