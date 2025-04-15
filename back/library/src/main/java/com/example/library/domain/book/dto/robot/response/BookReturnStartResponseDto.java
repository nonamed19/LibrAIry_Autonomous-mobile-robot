package com.example.library.domain.book.dto.robot.response;

public class BookReturnStartResponseDto {

    private double libraryMapX;
    private double libraryMapY;
    private double libraryMapW;

    public BookReturnStartResponseDto() {
    }

    public BookReturnStartResponseDto(double libraryMapX, double libraryMapY, double libraryMapW) {
        this.libraryMapX = libraryMapX;
        this.libraryMapY = libraryMapY;
        this.libraryMapW = libraryMapW;
    }

    public double getLibraryMapX() {
        return libraryMapX;
    }

    public double getLibraryMapY() {
        return libraryMapY;
    }

    public double getLibraryMapW() {
        return libraryMapW;
    }
}
