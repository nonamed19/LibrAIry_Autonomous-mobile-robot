package com.example.library.domain.book.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDate;

@Entity
public class BookRank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rank_id")
    private int rankId;
    private int borrowCount;
    private int rankingPeriod;
    private LocalDate updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private Book book;

    public BookRank() {
    }

    public int getBorrowCount() {
        return borrowCount;
    }

    public int getRankingPeriod() {
        return rankingPeriod;
    }

    public LocalDate getUpdatedAt() {
        return updatedAt;
    }

    public Book getBook() {
        return book;
    }
}
