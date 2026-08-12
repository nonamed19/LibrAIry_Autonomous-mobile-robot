package com.example.library.domain.arrivezone.entity;

import com.example.library.domain.book.entity.Book;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class ArriveZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "arrive_zone_id")
    private int arriveZoneId;
    private String arriveZoneName;
    private int arriveZoneBook;
    private LocalDateTime arriveZoneTime;

    @OneToOne
    @JoinColumn(name = "library_map_id")
    private LibraryMap libraryMap;

    @OneToMany(mappedBy = "arriveZone")
    private List<Book> bookList = new ArrayList<>();

    public ArriveZone() {
    }

    public ArriveZone(String arriveZoneName, int arriveZoneBook, LocalDateTime arriveZoneTime,
        LibraryMap libraryMap) {
        this.arriveZoneName = arriveZoneName;
        this.arriveZoneBook = arriveZoneBook;
        this.arriveZoneTime = arriveZoneTime;
        this.libraryMap = libraryMap;
    }

    public int getArriveZoneId() {
        return arriveZoneId;
    }

    public String getArriveZoneName() {
        return arriveZoneName;
    }

    public void setArriveZoneName(String arriveZoneName) {
        this.arriveZoneName = arriveZoneName;
    }

    public int getArriveZoneBook() {
        return arriveZoneBook;
    }

    public void setArriveZoneBook(int arriveZoneBook) {
        this.arriveZoneBook = arriveZoneBook;
    }

    public LocalDateTime getArriveZoneTime() {
        return arriveZoneTime;
    }

    public void setArriveZoneTime(LocalDateTime arriveZoneTime) {
        this.arriveZoneTime = arriveZoneTime;
    }

    public LibraryMap getLibraryMap() {
        return libraryMap;
    }

    public void setLibraryMap(LibraryMap libraryMap) {
        this.libraryMap = libraryMap;
    }

    public List<Book> getBookList() {
        return bookList;
    }

    public void addBook(Book book) {
        if (bookList.contains(book)) {
            return;
        }

        bookList.add(book);
    }

    public void deleteBook(Book book) {
        bookList.remove(book);
    }

    public void addBookCount() {
        arriveZoneBook += 1;
    }

    public void resetBookCount() {
        arriveZoneBook = 0;
    }
}
