package com.example.library.domain.book.service;

import com.example.library.domain.book.dto.robot.request.BookRobotRequestDto;
import com.example.library.domain.book.dto.user.request.BookFrontRequestDto;
import com.example.library.domain.book.dto.user.response.BookFrontResponseDto;
import com.example.library.domain.book.entity.Book;
import com.example.library.domain.book.entity.BookStatus;
import com.example.library.domain.book.repository.BookRepository;
import com.example.library.domain.robot.repository.RobotRepository;
import java.time.Duration;
import java.util.NoSuchElementException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class BookConnectService {

    private final RedisTemplate<String, String> redisTemplate;

    private BookRepository bookRepository;
    private RobotRepository robotRepository;

    private final static String REDIS_KEY = "book_borrow/";

    public BookConnectService(RedisTemplate<String, String> redisTemplate,
        BookRepository bookRepository, RobotRepository robotRepository) {
        this.redisTemplate = redisTemplate;
        this.bookRepository = bookRepository;
        this.robotRepository = robotRepository;
    }

    public void saveBookInfo(BookRobotRequestDto bookRobotRequestDto) {
        if (!robotRepository.existsById(bookRobotRequestDto.getRobotId())) {
            throw new NoSuchElementException("로봇 정보가 존재하지 않습니다!");
        }

        if (!bookRepository.existsById(bookRobotRequestDto.getBookId())) {
            throw new NoSuchElementException("책 정보가 존재하지 않습니다!");
        }

        redisTemplate.opsForValue()
            .set(REDIS_KEY + bookRobotRequestDto.getRobotId(),
                bookRobotRequestDto.getBookId(), Duration.ofMinutes(5));
    }

    public BookFrontResponseDto getBookInfo(BookFrontRequestDto bookFrontRequestDto) {
        String targetRedisKey = REDIS_KEY + bookFrontRequestDto.getRobotId();
        String targetBookId = redisTemplate.opsForValue().get(targetRedisKey);

        if (targetBookId == null) {
            throw new NoSuchElementException("저장된 책 데이터가 없습니다.");
        }

        Book targetBook = bookRepository.findById(targetBookId)
            .orElseThrow(() -> new NoSuchElementException("해당 바코드 데이터가 존재하지 않습니다."));

        redisTemplate.delete(targetRedisKey);
        return new BookFrontResponseDto(
            targetBook.getBookId(),
            targetBook.getBookIsbn(),
            BookStatus.values()[targetBook.getBookStatus()].getStatusDisc()
        );
    }
}
