package com.example.library.domain.book.dto.robot.request;

public class BookReturnStartRequestDto {

    private String bookId;
    private int robotId;

    public BookReturnStartRequestDto() {
    }

    public BookReturnStartRequestDto(String bookId, int robotId) {
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
