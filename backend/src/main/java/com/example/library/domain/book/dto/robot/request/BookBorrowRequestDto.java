package com.example.library.domain.book.dto.robot.request;

public class BookBorrowRequestDto {

    private String bookId;
    private int robotId;
    private int userId;

    public BookBorrowRequestDto() {
    }

    public BookBorrowRequestDto(String bookId, int robotId, int userId) {
        this.bookId = bookId;
        this.robotId = robotId;
        this.userId = userId;
    }

    public String getBookId() {
        return bookId;
    }

    public int getRobotId() {
        return robotId;
    }

    public int getUserId() {
        return userId;
    }
}
