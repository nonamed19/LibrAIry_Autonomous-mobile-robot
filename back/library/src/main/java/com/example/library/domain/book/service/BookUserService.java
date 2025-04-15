package com.example.library.domain.book.service;

import com.example.library.domain.arrivezone.entity.ArriveZone;
import com.example.library.domain.arrivezone.repository.ArriveZoneRepository;
import com.example.library.domain.book.dto.user.request.BookDeleteRequestDto;
import com.example.library.domain.book.dto.user.request.BookUpdateRequestDto;
import com.example.library.domain.book.dto.user.response.BookDetailResponseDto;
import com.example.library.domain.book.dto.user.response.BookSearchResponseDto;
import com.example.library.domain.book.entity.Book;
import com.example.library.domain.book.mapper.BookMapper;
import com.example.library.domain.book.repository.BookRepository;
import com.example.library.domain.robot.repository.RobotRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class BookUserService {

    BookRepository bookRepository;
    BookMapper bookMapper;
    ArriveZoneRepository arriveZoneRepository;
    RobotRepository robotRepository;

    public BookUserService(BookRepository bookRepository, ArriveZoneRepository arriveZoneRepository
        , BookMapper bookMapper, RobotRepository robotRepository) {
        this.bookRepository = bookRepository;
        this.arriveZoneRepository = arriveZoneRepository;
        this.bookMapper = bookMapper;
        this.robotRepository = robotRepository;
    }


    public BookSearchResponseDto searchBook(String searchString, int action) {
        List<Book> bookList = null;

        if (action == 0) {
            bookList = bookRepository.searchByBookTitle(searchString);
        }
        if (action == 1) {
            bookList = bookRepository.searchByBookWriter(searchString);
        }
        if (action == 2) {
            bookList = bookRepository.searchByBookPublisher(searchString);
        }
        if (action == 3) {
            bookList = bookRepository.searchByBookId(searchString);
        }

        return new BookSearchResponseDto(bookList.stream()
            .map(bookMapper::entityToDto)
            .toList());
    }

    public void insertBook(BookUpdateRequestDto bookUpdateRequestDto) {
        ArriveZone arriveZone = arriveZoneRepository.findByArriveZoneName(
                bookUpdateRequestDto.getArriveZoneName())
            .orElseThrow(() -> new NoSuchElementException("해당 회수 구역이 존재하지 않습니다."));

        Book newBook = bookMapper.updateDtoToEntity(bookUpdateRequestDto, arriveZone);

        bookRepository.save(newBook);
    }

    public void updateBook(BookUpdateRequestDto bookUpdateRequestDto) {
        ArriveZone arriveZone = arriveZoneRepository.findByArriveZoneName(
                bookUpdateRequestDto.getArriveZoneName())
            .orElseThrow(() -> new NoSuchElementException("해당 회수 구역이 존재하지 않습니다."));

        Book targetBook = bookRepository.findById(bookUpdateRequestDto.getBookId())
            .orElseThrow(() -> new NoSuchElementException("해당 바코드 데이터가 존재하지 않습니다."));

        bookMapper.updateEntity(targetBook, bookUpdateRequestDto, arriveZone);
    }

    public void deleteBook(BookDeleteRequestDto bookDeleteRequestDto) {
        Book targetBook = bookRepository.findById(bookDeleteRequestDto.getBookId())
            .orElseThrow(() -> new NoSuchElementException("해당 바코드 데이터가 존재하지 않습니다."));

        bookRepository.delete(targetBook);
    }

    public BookDetailResponseDto getBookDetail(String bookId) {
        Book targetBook = bookRepository.findById(bookId)
            .orElseThrow(() -> new NoSuchElementException("해당 바코드 데이터가 존재하지 않습니다."));

        return bookMapper.entityToDetailDto(targetBook);
    }
}
