package com.example.library.domain.book.entity;

import com.example.library.domain.arrivezone.entity.ArriveZone;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Entity
public class Book {

    @Id
    private String bookId;
    private String bookIsbn;
    private String bookTitle;
    private String bookWriter;
    private String bookPublisher;
    private int bookStatus;
    private String bookSign;
    private LocalDateTime bookCreatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "arrive_zone_id")
    private ArriveZone arriveZone;

    @OneToMany(mappedBy = "book", cascade = CascadeType.REMOVE)
    private List<BorrowRecord> borrowRecordList = new ArrayList<>();

    public Book() {
    }

    public Book(String bookId, String bookIsbn, String bookTitle, String bookWriter,
        String bookPublisher, int bookStatus, String bookSign, LocalDateTime bookCreatedAt,
        ArriveZone arriveZone) {
        this.bookId = bookId;
        this.bookIsbn = bookIsbn;
        this.bookTitle = bookTitle;
        this.bookWriter = bookWriter;
        this.bookPublisher = bookPublisher;
        this.bookStatus = bookStatus;
        this.bookSign = bookSign;
        this.bookCreatedAt = bookCreatedAt;

        this.arriveZone = arriveZone;
        arriveZone.addBook(this);
    }

    public String getBookId() {
        return bookId;
    }

    public void setBookId(String bookId) {
        this.bookId = bookId;
    }

    public String getBookIsbn() {
        return bookIsbn;
    }

    public void setBookIsbn(String bookIsbn) {
        this.bookIsbn = bookIsbn;
    }

    public String getBookTitle() {
        return bookTitle;
    }

    public void setBookTitle(String bookTitle) {
        this.bookTitle = bookTitle;
    }

    public String getBookWriter() {
        return bookWriter;
    }

    public void setBookWriter(String bookWriter) {
        this.bookWriter = bookWriter;
    }

    public String getBookPublisher() {
        return bookPublisher;
    }

    public void setBookPublisher(String bookPublisher) {
        this.bookPublisher = bookPublisher;
    }

    public int getBookStatus() {
        return bookStatus;
    }

    public void setBookStatus(int bookStatus) {
        this.bookStatus = bookStatus;
    }

    public String getBookSign() {
        return bookSign;
    }

    public void setBookSign(String bookSign) {
        this.bookSign = bookSign;
    }

    public LocalDateTime getBookCreatedAt() {
        return bookCreatedAt;
    }

    public void setBookCreatedAt(LocalDateTime bookCreatedAt) {
        this.bookCreatedAt = bookCreatedAt;
    }

    public ArriveZone getArriveZone() {
        return arriveZone;
    }

    public void setArriveZone(ArriveZone arriveZone) {
        this.arriveZone.deleteBook(this);
        arriveZone.addBook(this);

        this.arriveZone = arriveZone;
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

    public LocalDate getBookReturn() {
        if (borrowRecordList.size() == 0 || bookStatus != 0) {
            return null;
        }

        return borrowRecordList.get(borrowRecordList.size() - 1)
            .getBorrowAt()
            .plusWeeks(2)
            .toLocalDate();
    }

    public BorrowRecord getLastBorrowRecord() {
        if (borrowRecordList.size() == 0 || bookStatus != 0) {
            throw new NoSuchElementException("대출 기록이 없습니다");
        }

        return borrowRecordList.get(borrowRecordList.size() - 1);
    }
}
