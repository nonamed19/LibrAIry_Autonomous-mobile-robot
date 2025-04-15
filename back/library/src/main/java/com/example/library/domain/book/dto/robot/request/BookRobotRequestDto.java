package com.example.library.domain.book.dto.robot.request;

public class BookRobotRequestDto {

    private int robotId;
    private String bookId;

    public BookRobotRequestDto() {
    }

    public BookRobotRequestDto(int robotId, String bookId) {
        this.robotId = robotId;
        this.bookId = bookId;
    }

    public int getRobotId() {
        return robotId;
    }

    public String getBookId() {
        return bookId;
    }
}
