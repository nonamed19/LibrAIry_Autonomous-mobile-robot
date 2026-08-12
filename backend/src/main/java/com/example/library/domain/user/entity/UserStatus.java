package com.example.library.domain.user.entity;

public enum UserStatus {
    NORMAL("정상"),
    INACTIVE("휴면"),
    DELETED("탈퇴");

    private final String statusDisc;

    UserStatus(String statusDisc) {
        this.statusDisc = statusDisc;
    }

    public String getStatusDisc() {
        return this.statusDisc;
    }
}
