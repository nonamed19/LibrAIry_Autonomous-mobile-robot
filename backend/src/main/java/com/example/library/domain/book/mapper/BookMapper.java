package com.example.library.domain.book.mapper;

import com.example.library.domain.arrivezone.entity.ArriveZone;
import com.example.library.domain.book.dto.BookDto;
import com.example.library.domain.book.dto.user.request.BookUpdateRequestDto;
import com.example.library.domain.book.dto.user.response.BookDetailResponseDto;
import com.example.library.domain.book.dto.user.response.BookMostListResponseDto.BookRankDto;
import com.example.library.domain.book.entity.Book;
import com.example.library.domain.book.entity.BookRank;
import com.example.library.domain.book.entity.BookStatus;
import java.time.LocalDateTime;
import org.springframework.stereotype.Component;

@Component
public class BookMapper {

    public Book updateDtoToEntity(BookUpdateRequestDto bookUpdateRequestDto,
        ArriveZone arriveZone) {

        return new Book(
            bookUpdateRequestDto.getBookId(),
            bookUpdateRequestDto.getBookIsbn(),
            bookUpdateRequestDto.getBookTitle(),
            bookUpdateRequestDto.getBookWriter(),
            bookUpdateRequestDto.getBookPublisher(),
            bookUpdateRequestDto.getBookStatus(),
            bookUpdateRequestDto.getBookSign(),
            LocalDateTime.now(),
            arriveZone
        );
    }

    public void updateEntity(Book targetBook, BookUpdateRequestDto bookUpdateRequestDto,
        ArriveZone arriveZone) {

        targetBook.setBookId(bookUpdateRequestDto.getBookId());
        targetBook.setBookIsbn(bookUpdateRequestDto.getBookIsbn());
        targetBook.setBookTitle(bookUpdateRequestDto.getBookTitle());
        targetBook.setBookWriter(bookUpdateRequestDto.getBookWriter());
        targetBook.setBookPublisher(bookUpdateRequestDto.getBookPublisher());
        targetBook.setBookStatus(bookUpdateRequestDto.getBookStatus());
        targetBook.setBookSign(bookUpdateRequestDto.getBookSign());
        targetBook.setBookCreatedAt(LocalDateTime.now());
        targetBook.setArriveZone(arriveZone);
    }

    public BookDto entityToDto(Book book) {

        return new BookDto(
            book.getBookId(),
            book.getBookIsbn(),
            BookStatus.values()[book.getBookStatus()].getStatusDisc(),
            book.getBookSign(),
            book.getBookReturn(),
            book.getArriveZone().getArriveZoneName()
        );
    }

    public BookDetailResponseDto entityToDetailDto(Book book) {
        return new BookDetailResponseDto(
            book.getBookId(),
            book.getBookIsbn(),
            BookStatus.values()[book.getBookStatus()].getStatusDisc(),
            book.getBookSign(),
            book.getBookReturn()
        );
    }

    public BookRankDto entityToRankDto(BookRank bookRank) {
        Book targetBook = bookRank.getBook();

        return new BookRankDto(
            targetBook.getBookId(),
            targetBook.getBookIsbn(),
            BookStatus.values()[targetBook.getBookStatus()].getStatusDisc(),
            targetBook.getBookSign(),
            targetBook.getBookReturn(),
            bookRank.getBorrowCount()
        );
    }
}
