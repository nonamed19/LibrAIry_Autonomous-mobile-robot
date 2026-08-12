package com.example.library.domain.book.entity;

import com.example.library.domain.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class BorrowRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "borrow_record_id")
    private int borrowRecordId;
    private LocalDateTime borrowAt;
    private LocalDateTime returnAt = null;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private Book book;

    public BorrowRecord() {
    }

    public BorrowRecord(LocalDateTime borrowAt, User user, Book book) {
        this.borrowAt = borrowAt;
        setUser(user);
        setBook(book);
    }

    public int getBorrowRecordId() {
        return borrowRecordId;
    }

    public LocalDateTime getBorrowAt() {
        return borrowAt;
    }

    public void setBorrowAt(LocalDateTime borrowAt) {
        this.borrowAt = borrowAt;
    }

    public LocalDateTime getReturnAt() {
        return returnAt;
    }

    public void setReturnAt(LocalDateTime returnAt) {
        this.returnAt = returnAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;

        user.addBorrowRecord(this);
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;

        book.addBorrowRecord(this);
    }

    public String getBorrowRecordStatus() {
        if (returnAt != null) {
            return BorrowRecordStatus.RETURNED.getStatusDisc();
        }

        if (borrowAt.toLocalDate().plusWeeks(2).isBefore(LocalDate.now())) {
            return BorrowRecordStatus.OVERDUE.getStatusDisc();
        }

        return BorrowRecordStatus.BORROWED.getStatusDisc();
    }

}
