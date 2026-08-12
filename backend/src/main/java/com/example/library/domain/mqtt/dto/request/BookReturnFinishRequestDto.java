package com.example.library.domain.mqtt.dto.request;

public class BookReturnFinishRequestDto {

    private int robotId;
    private String bookId;

    public BookReturnFinishRequestDto() {
    }

    public BookReturnFinishRequestDto(int robotId, String bookId) {
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
