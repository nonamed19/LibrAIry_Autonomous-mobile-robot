package com.example.library.domain.book.service;

import com.example.library.domain.arrivezone.entity.LibraryMap;
import com.example.library.domain.book.dto.robot.request.BookBorrowRequestDto;
import com.example.library.domain.book.dto.robot.request.BookReturnEndRequestDto;
import com.example.library.domain.book.dto.robot.request.BookReturnStartRequestDto;
import com.example.library.domain.book.dto.robot.response.BookReturnStartResponseDto;
import com.example.library.domain.book.entity.Book;
import com.example.library.domain.book.entity.BorrowRecord;
import com.example.library.domain.book.repository.BookRepository;
import com.example.library.domain.book.repository.BorrowRecordRepository;
import com.example.library.domain.notice.entity.Notice;
import com.example.library.domain.notice.repository.NoticeRepository;
import com.example.library.domain.robot.entity.Robot;
import com.example.library.domain.robot.entity.RobotLog;
import com.example.library.domain.robot.repository.RobotLogRepository;
import com.example.library.domain.robot.repository.RobotRepository;
import com.example.library.domain.user.entity.User;
import com.example.library.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class BookRobotService {

    BookRepository bookRepository;
    BorrowRecordRepository borrowRecordRepository;
    RobotRepository robotRepository;
    RobotLogRepository robotLogRepository;
    UserRepository userRepository;
    NoticeRepository noticeRepository;

    public BookRobotService(BookRepository bookRepository,
        BorrowRecordRepository borrowRecordRepository, RobotRepository robotRepository,
        RobotLogRepository robotLogRepository, UserRepository userRepository,
        NoticeRepository noticeRepository) {

        this.bookRepository = bookRepository;
        this.borrowRecordRepository = borrowRecordRepository;
        this.robotRepository = robotRepository;
        this.robotLogRepository = robotLogRepository;
        this.userRepository = userRepository;
        this.noticeRepository = noticeRepository;
    }

    public void borrowBook(BookBorrowRequestDto bookBorrowRequestDto) {
        User targetUser = userRepository.findById(bookBorrowRequestDto.getUserId())
            .orElseThrow(() -> new NoSuchElementException("해당 유저 데이터가 존재하지 않습니다."));

        Book targetBook = bookRepository.findById(bookBorrowRequestDto.getBookId())
            .orElseThrow(() -> new NoSuchElementException("해당 책 데이터가 존재하지 않습니다."));

        if (targetBook.getBookStatus() != 1) {
            throw new NoSuchElementException("이미 대출 중인 책입니다.");
        }

        Robot targetRobot = robotRepository.findById(bookBorrowRequestDto.getRobotId())
            .orElseThrow(() -> new NoSuchElementException("해당 로봇 데이터가 존재하지 않습니다."));

        BorrowRecord newBorrowRecord = new BorrowRecord(LocalDateTime.now(), targetUser,
            targetBook);

        String borrowContent = createBorrowContent(targetRobot, targetUser, targetBook);

        RobotLog newRobotLog = new RobotLog(2, borrowContent, LocalDateTime.now(), targetRobot);
        newRobotLog.setRobotLogCompletedAt(LocalDateTime.now());

        Notice newNotice = new Notice(LocalDateTime.now(), true, 2, borrowContent, targetRobot);

        targetBook.setBookStatus(0);
        borrowRecordRepository.save(newBorrowRecord);
        robotLogRepository.save(newRobotLog);
        noticeRepository.save(newNotice);
    }

    private String createBorrowContent(Robot targetRobot, User targetUser, Book targetBook) {
        return "로봇 " + targetRobot.getRobotName() + " : "
            + targetUser.getUserName() + "님이 "
            + targetBook.getBookTitle() + "을(를) 대출";
    }

    public BookReturnStartResponseDto returnBookStart(
        BookReturnStartRequestDto BookReturnStartRequestDto) {
        Book targetBook = bookRepository.findById(BookReturnStartRequestDto.getBookId())
            .orElseThrow(() -> new NoSuchElementException("해당 책 데이터가 존재하지 않습니다."));

        Robot targetRobot = robotRepository.findById(BookReturnStartRequestDto.getRobotId())
            .orElseThrow(() -> new NoSuchElementException("해당 로봇 데이터가 존재하지 않습니다."));

        if (targetBook.getBookStatus() == 0) {
            BorrowRecord targetBorrowRecord = targetBook.getLastBorrowRecord();
            targetBorrowRecord.setReturnAt(LocalDateTime.now());
            targetBook.setBookStatus(1);
        }

        RobotLog newRobotLog = new RobotLog(
            1, createReturnContent(targetRobot, targetBook),
            LocalDateTime.now(), targetRobot);

        LibraryMap libraryMap = targetBook.getArriveZone().getLibraryMap();

        robotLogRepository.save(newRobotLog);
        return new BookReturnStartResponseDto(
            libraryMap.getLibraryMapX(), libraryMap.getLibraryMapY(), libraryMap.getLibraryMapW()
        );
    }

    public void returnBookEnd(BookReturnEndRequestDto bookReturnEndRequestDto) {
        Book targetBook = bookRepository.findById(bookReturnEndRequestDto.getBookId())
            .orElseThrow(() -> new NoSuchElementException("해당 책 데이터가 존재하지 않습니다."));

        Robot targetRobot = robotRepository.findById(bookReturnEndRequestDto.getRobotId())
            .orElseThrow(() -> new NoSuchElementException("해당 로봇 데이터가 존재하지 않습니다."));

        Notice newNotice = new Notice(LocalDateTime.now(), true, 1,
            createReturnContent(targetRobot, targetBook), targetRobot);

        targetRobot.completeLastRobotLog();
        noticeRepository.save(newNotice);
        targetBook.getArriveZone().addBookCount();
    }

    private String createReturnContent(Robot targetRobot, Book targetBook) {
        return "로봇 " + targetRobot.getRobotName() + " : "
            + targetBook.getBookTitle() + "을(를) "
            + targetBook.getArriveZone().getArriveZoneName() + "에 반납";
    }
}
