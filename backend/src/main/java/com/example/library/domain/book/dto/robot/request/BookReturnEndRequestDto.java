package com.example.library.domain.book.dto.robot.request;

public class BookReturnEndRequestDto {

    private String bookId;
    private int robotId;

    public BookReturnEndRequestDto() {
    }

    public BookReturnEndRequestDto(String bookId, int robotId) {
        this.bookId = bookId;
        this.robotId = robotId;
    }

    public String getBookId() {
        return bookId;
    }

    public int getRobotId() {
        return robotId;
    }
}
