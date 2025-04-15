package com.example.library.domain.user.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;

public class UserRecordResponseDto {

    private List<UserRecordDto> userRecordList;

    public UserRecordResponseDto() {
    }

    public UserRecordResponseDto(List<UserRecordDto> userRecordList) {
        this.userRecordList = userRecordList;
    }

    public List<UserRecordDto> getUserRecordList() {
        return userRecordList;
    }


    public static class UserRecordDto {

        private String bookIsbn;
        private LocalDateTime borrowAt;
        private LocalDateTime returnAt;
        @Schema(description = "반납 완료, 대출 중, 연체 중...", example = "반납 완료")
        private String status;

        public UserRecordDto() {
        }

        public UserRecordDto(String bookIsbn, LocalDateTime borrowAt, LocalDateTime returnAt,
            String status) {
            this.bookIsbn = bookIsbn;
            this.borrowAt = borrowAt;
            this.returnAt = returnAt;
            this.status = status;
        }

        public String getBookIsbn() {
            return bookIsbn;
        }

        public LocalDateTime getBorrowAt() {
            return borrowAt;
        }

        public LocalDateTime getReturnAt() {
            return returnAt;
        }

        public String getStatus() {
            return status;
        }
    }

}
