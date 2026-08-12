package com.example.library.domain.book.entity;

public enum BookStatus {
    BORROW("대출 중"),
    EXIST("대출 가능"),
    LOADING("정리 중");

    private final String statusDisc;

    BookStatus(String statusDisc) {
        this.statusDisc = statusDisc;
    }

    public String getStatusDisc() {
        return this.statusDisc;
    }
}
