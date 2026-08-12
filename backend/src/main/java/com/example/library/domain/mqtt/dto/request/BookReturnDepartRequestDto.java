package com.example.library.domain.mqtt.dto.request;

public class BookReturnDepartRequestDto {

    private int robotId;
    private String bookId;

    public BookReturnDepartRequestDto() {
    }

    public BookReturnDepartRequestDto(int robotId, String bookId) {
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
