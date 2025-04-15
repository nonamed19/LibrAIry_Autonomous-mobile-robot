package com.example.library.domain.book.dto.user.response;

import java.time.LocalDate;
import java.util.List;

public class BookMostListResponseDto {

    private List<BookRankDto> bookRankList;

    public BookMostListResponseDto() {
    }

    public BookMostListResponseDto(List<BookRankDto> bookRankList) {
        this.bookRankList = bookRankList;
    }

    public List<BookRankDto> getBookRankList() {
        return bookRankList;
    }

    public static class BookRankDto {

        private String bookId;
        private String bookIsbn;
        private String bookStatus;
        private String bookSign;
        private LocalDate bookReturn;
        private int borrowCount;

        public BookRankDto() {
        }

        public BookRankDto(String bookId, String bookIsbn, String bookStatus, String bookSign,
            LocalDate bookReturn, int borrowCount) {
            this.bookId = bookId;
            this.bookIsbn = bookIsbn;
            this.bookStatus = bookStatus;
            this.bookSign = bookSign;
            this.bookReturn = bookReturn;
            this.borrowCount = borrowCount;
        }

        public String getBookId() {
            return bookId;
        }

        public String getBookIsbn() {
            return bookIsbn;
        }

        public String getBookStatus() {
            return bookStatus;
        }

        public String getBookSign() {
            return bookSign;
        }

        public LocalDate getBookReturn() {
            return bookReturn;
        }

        public int getBorrowCount() {
            return borrowCount;
        }
    }
}
