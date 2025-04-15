CREATE TABLE book_rank (
    rank_id INT PRIMARY KEY AUTO_INCREMENT,
    borrow_count INT NOT NULL,
    ranking_period TINYINT NOT NULL,
    updated_at DATE NOT NULL,
    book_id varchar(255) NOT NULL,
    UNIQUE (book_id, ranking_period)
);

ALTER TABLE book_rank
    ADD CONSTRAINT
        FOREIGN KEY (book_id) REFERENCES `book` (book_id);

DELIMITER $$

CREATE PROCEDURE get_weekly_top_books()
BEGIN
  REPLACE INTO book_rank (book_id, borrow_count, ranking_period, updated_at)
  SELECT b.book_id, COUNT(b.book_id) AS borrow_count, 0, NOW()
  FROM book b
  JOIN borrow_record br ON b.book_id = br.book_id
  WHERE br.borrow_at BETWEEN
  DATE_SUB(DATE(NOW()), INTERVAL WEEKDAY(NOW()) + 7 DAY) AND
  DATE_SUB(DATE(NOW()), INTERVAL WEEKDAY(NOW()) + 1 DAY)
  GROUP BY b.book_id
  ORDER BY borrow_count DESC
  LIMIT 10;
END $$

CREATE PROCEDURE get_monthly_top_books()
BEGIN
  REPLACE INTO book_rank (book_id, borrow_count, ranking_period, updated_at)
  SELECT b.book_id, COUNT(b.book_id) AS borrow_count, 1, NOW()
  FROM book b
  JOIN borrow_record br ON b.book_id = br.book_id
  WHERE br.borrow_at BETWEEN 
  DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m-01')
  AND LAST_DAY(DATE_SUB(NOW(), INTERVAL 1 MONTH))
  GROUP BY b.book_id
  ORDER BY borrow_count DESC
  LIMIT 10;
END $$

DELIMITER ;

CALL get_weekly_top_books();
CALL get_monthly_top_books();