package com.example.library.domain.user.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Salt {

    @Id
    private int userId;
    private String salt;

    public Salt() {
    }

    public Salt(int userId, String salt) {
        super();
        this.userId = userId;
        this.salt = salt;
    }

    public int getUserId() {
        return userId;
    }

    public String getSalt() {
        return salt;
    }

}
