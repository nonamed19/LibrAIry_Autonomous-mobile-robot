-- user 테이블 더미 데이터
INSERT INTO `user` (user_login_id, user_password, user_name, user_email, user_birth, user_created_at, user_status, user_code)
VALUES
('user001', 'pass123!', '홍길동', 'user001@example.com', '1990-01-01', '2024-02-03', 0, 'U001XYZ'),
('user002', 'pass123!', '김철수', 'user002@example.com', '1992-03-15', '2024-02-03', 0, 'U002XYZ'),
('user003', 'pass123!', '이영희', 'user003@example.com', '1988-07-22', '2024-02-03', 0, 'U003XYZ'),
('user004', 'pass123!', '박민수', 'user004@example.com', '1995-12-10', '2024-02-03', 0, 'U004XYZ'),
('user005', 'pass123!', '최지은', 'user005@example.com', '2000-06-05', '2024-02-03', 0, 'U005XYZ'),
('user006', 'pass123!', '정우성', 'user006@example.com', '1985-09-09', '2024-02-03', 0, 'U006XYZ'),
('user007', 'pass123!', '한지민', 'user007@example.com', '1998-11-18', '2024-02-03', 0, 'U007XYZ'),
('user008', 'pass123!', '신혜선', 'user008@example.com', '1993-04-25', '2024-02-03', 0, 'U008XYZ'),
('user009', 'pass123!', '조세호', 'user009@example.com', '1991-08-30', '2024-02-03', 0, 'U009XYZ'),
('user010', 'pass123!', '강호동', 'user010@example.com', '1980-05-20', '2024-02-03', 0, 'U010XYZ');

-- robot 테이블 더미 데이터
INSERT INTO robot (robot_name)
VALUES
('RoboA1'),
('RoboA2'),
('RoboA3'),
('RoboA4'),
('RoboA5'),
('RoboA6'),
('RoboA7'),
('RoboA8'),
('RoboA9'),
('RoboA10');

-- map 테이블 더미 데이터
INSERT INTO `library_map` (library_map_id, library_map_name, library_map_x, library_map_y, library_map_w)
VALUES
(1, 'MapPoint1', 4.5, 1.0, 90),
(2, 'MapPoint2', 6, 1.0, 90),
(3, 'MapPoint3', 0, 0, 0),
(4, 'MapPoint4', 1.0, 1.0, 1.0),
(5, 'MapPoint5', 1.0, 1.0, 1.0),
(6, 'MapPoint6', 1.0, 1.0, 1.0),
(7, 'MapPoint7', 1.0, 1.0, 1.0),
(8, 'MapPoint8', 1.0, 1.0, 1.0),
(9, 'MapPoint9', 1.0, 1.0, 1.0),
(10, 'MapPoint10', 1.0, 1.0, 1.0);

-- arrive_zone 테이블 더미 데이터
INSERT INTO arrive_zone (arrive_zone_name, arrive_zone_book, arrive_zone_time, library_map_id)
VALUES
('문학', 3, '2024-02-03 10:30:00', 1),
('기술과학', 5, '2024-02-03 11:00:00', 2),
('철학', 2, '2024-02-03 12:15:00', 3),
('종교', 4, '2024-02-03 13:45:00', 4),
('사회과학', 1, '2024-02-03 14:00:00', 5),
('자연과학', 6, '2024-02-03 15:20:00', 6),
('예술', 3, '2024-02-03 16:10:00', 7),
('언어', 5, '2024-02-03 17:30:00', 8),
('총류', 2, '2024-02-03 18:45:00', 9),
('역사', 4, '2024-02-03 19:00:00', 10),
('Initial_Zone', 0, NOW(), 3);

UPDATE arrive_zone SET arrive_zone_id = 0 WHERE arrive_zone_id = 1001;


INSERT INTO book (book_id, book_isbn, book_title, book_writer, book_publisher, book_status, book_sign, book_created_at, arrive_zone_id)
VALUES
('2502031211', '9788932034812', '여수의 사랑', '한강', '문학과지성사', 1, '813.62-ㅎ225ㅇ3', '2025-02-03 03:22:27', 1),
('2502031214', '9788936434120', '소년이 온다', '한강', '창비', 1, '813.7-ㅎ225ㅅ=6', '2025-02-03 03:22:34', 1),
('2502031215', '9788954682152', '작별하지 않는다', '한강', '문학과지성사', 1, '813.7-ㅎ225ㅈ=2', '2025-02-03 03:22:38', 1),
('2502031217', '9788954616515', '희랍어 시간', '한강', '문학동네', 1, '813.7-ㅎ225ㅎ', '2025-02-03 03:22:47', 1),
('2502031218', '9788954651134', '흰', '한강', '문학동네', 1, '813.7-ㅎ225흐2=4', '2025-02-03 03:22:52', 1),
('2502031219', '9788954648905', '검은사슴', '한강', '문학과지성사', 0, '813.62-ㅎ225ㄱ', '2025-02-03 08:06:27', 1),
('2502031220', '9788932024639', '서랍에 저녁을 넣어 두었다', '한강', '문학과지성사', 1, '811.7-ㅎ225ㅅ', '2025-02-03 03:23:01', 1),
('2502031221', '9788932020006', '바람이 분다, 가라', '한강', '문학과지성사', 1, '813.6-ㅎ225ㅂ=2', '2025-02-03 03:23:06', 1),
('2502031222', '9791158884680', '종이 동물원', '켄 리우', '황금가지', 1, '843.6-ㄹ948ㅈ=2', '2025-02-03 03:23:12', 1),
('590443774914', '9791193790656', '해리포터와 마법사의 돌', 'J.K. 롤링', '문학수첩', 1, '330.9-ㅋ232ㅌ', NOW(), 1),
('628134672746', '9791193790670', '해리포터와 아즈카반의 죄수', 'J.K. 롤링', '문학수첩', 1, '813.7-ㄱ976ㅇ=2', NOW(), 1),
('414072919797', '9788934939870', '어디에나 있고 무엇이든 하는 알고리즘 이야기', '문병로', '김영사', 1, '863.6-ㅂ486ㅈ=3', NOW(), 2);


DELIMITER $$

CREATE PROCEDURE InsertDummyBorrowRecords(IN record_count INT)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE rand_book_id VARCHAR(255);
    DECLARE rand_user_id INT;
    DECLARE user_id INT;
    DECLARE rand_borrow_at DATETIME;
    DECLARE rand_return_at DATETIME;

    SET user_id = 3;

    WHILE i < record_count DO
        -- 랜덤한 book_id 가져오기
        SELECT book_id INTO rand_book_id
        FROM book
        ORDER BY RAND()
        LIMIT 1;

        SET rand_borrow_at = DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY);

        IF RAND() > 0.5 THEN
            SET rand_return_at = DATE_ADD(rand_borrow_at, INTERVAL FLOOR(RAND() * 14) DAY);
        ELSE
            SET rand_return_at = NULL;
        END IF;

        INSERT INTO borrow_record (borrow_at, return_at, book_id, user_id)
        VALUES (rand_borrow_at, rand_return_at, rand_book_id, rand_user_id);

        SET i = i + 1;
    END WHILE;
END $$

DELIMITER ;

CALL InsertDummyBorrowRecords(1000);