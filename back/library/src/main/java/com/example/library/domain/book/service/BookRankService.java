package com.example.library.domain.book.service;

import com.example.library.domain.book.dto.user.response.BookMostListResponseDto;
import com.example.library.domain.book.mapper.BookMapper;
import com.example.library.domain.book.repository.BookRankRepository;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class BookRankService {

    BookRankRepository bookRankRepository;
    BookMapper bookMapper;

    public BookRankService(BookRankRepository bookRankRepository, BookMapper bookMapper) {
        this.bookRankRepository = bookRankRepository;
        this.bookMapper = bookMapper;
    }

    public BookMostListResponseDto getBookMostList(int action) {
        return new BookMostListResponseDto(
            bookRankRepository.findAllByRankPeriod(action).stream()
                .map(bookRank -> bookMapper.entityToRankDto(bookRank))
                .toList()
        );
    }

    @Scheduled(cron = "0 0 3 * * MON") // 매주 월요일 새벽 3시
    public void updateWeeklyTopBooks() {
        bookRankRepository.updateWeeklyTopBooks();
    }

    @Scheduled(cron = "0 0 3 1 * *") // 매월 1일 새벽 3시
    public void updateMonthlyTopBooks() {
        bookRankRepository.updateMonthlyTopBooks();
    }
}
