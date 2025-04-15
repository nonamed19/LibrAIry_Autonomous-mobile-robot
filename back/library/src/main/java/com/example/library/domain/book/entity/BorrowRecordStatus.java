package com.example.library.domain.book.entity;

public enum BorrowRecordStatus {
    RETURNED("반납 완료"),
    BORROWED("대출 중"),
    OVERDUE("연체 중");

    private final String statusDisc;

    BorrowRecordStatus(String statusDisc) {
        this.statusDisc = statusDisc;
    }

    public String getStatusDisc() {
        return this.statusDisc;
    }
}
