package com.example.library.domain.websocket.dto.request;

public class BookSaveRequestDto {

    private int robotId;
    private String bookId;

    public BookSaveRequestDto() {
    }

    public BookSaveRequestDto(int robotId, String bookId) {
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
