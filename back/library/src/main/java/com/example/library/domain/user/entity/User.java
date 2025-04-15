package com.example.library.domain.user.entity;

import com.example.library.domain.book.entity.BorrowRecord;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int userId;
    private String userLoginId;
    private String userPassword;
    private String userName;
    private String userEmail;
    private LocalDate userBirth;
    private LocalDate userCreatedAt;
    private int userStatus;
    private String userCode;

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
    private List<BorrowRecord> borrowRecordList = new ArrayList<>();

    public User() {
    }

    public User(String userLoginId, String userPassword, String userName, String userEmail,
        LocalDate userBirth, LocalDate userCreatedAt, int userStatus, String userCode) {
        this.userLoginId = userLoginId;
        this.userPassword = userPassword;
        this.userName = userName;
        this.userEmail = userEmail;
        this.userBirth = userBirth;
        this.userCreatedAt = userCreatedAt;
        this.userStatus = userStatus;
        this.userCode = userCode;
    }

    public int getUserId() {
        return userId;
    }

    public String getUserLoginId() {
        return userLoginId;
    }

    public void setUserLoginId(String userLoginId) {
        this.userLoginId = userLoginId;
    }

    public String getUserPassword() {
        return userPassword;
    }

    public void setUserPassword(String userPassword) {
        this.userPassword = userPassword;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public LocalDate getUserBirth() {
        return userBirth;
    }

    public void setUserBirth(LocalDate userBirth) {
        this.userBirth = userBirth;
    }

    public LocalDate getUserCreatedAt() {
        return userCreatedAt;
    }

    public void setUserCreatedAt(LocalDate userCreatedAt) {
        this.userCreatedAt = userCreatedAt;
    }

    public int getUserStatus() {
        return userStatus;
    }

    public void setUserStatus(int userStatus) {
        this.userStatus = userStatus;
    }

    public String getUserCode() {
        return userCode;
    }

    public void setUserCode(String userCode) {
        this.userCode = userCode;
    }

    public List<BorrowRecord> getBorrowRecordList() {
        return borrowRecordList;
    }

    public void addBorrowRecord(BorrowRecord borrowRecord) {
        if (borrowRecordList.contains(borrowRecord)) {
            return;
        }

        borrowRecordList.add(borrowRecord);
    }

    public String getUserBorrowStatus() {
        if (userStatus != 0) {
            return UserStatus.values()[userStatus].getStatusDisc() + " 유저입니다.";
        }

        long bookBorrowCount = borrowRecordList.stream()
            .filter(borrowRecord -> borrowRecord.getReturnAt() == null)
            .count();

        if (bookBorrowCount >= 5) {
            return "대출 한도에 도달하였습니다.";
        }

        return "대출 가능";
    }

    public boolean hasBorrowBook() {
        return borrowRecordList.stream()
            .anyMatch(borrowRecord -> borrowRecord.getReturnAt() == null);
    }
}
