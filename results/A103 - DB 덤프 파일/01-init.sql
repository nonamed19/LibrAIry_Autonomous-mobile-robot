CREATE TABLE book
(
    book_id         varchar(255) PRIMARY KEY,
    book_isbn       varchar(255) NOT NULL,
    book_title      varchar(255) NOT NULL,
    book_writer     varchar(255) NULL,
    book_publisher  varchar(100) NULL,
    book_status     tinyint NULL,
    book_sign       varchar(100) NULL,
    book_created_at datetime NULL,
    arrive_zone_id  int          NOT NULL
);

CREATE TABLE `user`
(
    user_id         int PRIMARY KEY AUTO_INCREMENT,
    user_login_id   varchar(100) NOT NULL,
    user_password   varchar(100) NOT NULL,
    user_name       varchar(10)  NOT NULL,
    user_email      varchar(100) NOT NULL,
    user_birth      date         NOT NULL,
    user_created_at date         NOT NULL,
    user_status     tinyint  NOT NULL,
    user_code       varchar(255) NOT NULL
);

CREATE TABLE borrow_record
(
    borrow_record_id int PRIMARY KEY AUTO_INCREMENT,
    borrow_at        datetime     NOT NULL,
    return_at        datetime NULL,
    book_id          varchar(255) NOT NULL,
    user_id          int          NOT NULL
);

CREATE TABLE robot
(
    robot_id        int PRIMARY KEY AUTO_INCREMENT,
    robot_name      varchar(100) NOT NULL
);

CREATE TABLE notice
(
    notice_id         int PRIMARY KEY AUTO_INCREMENT,
    notice_created_at datetime     NOT NULL,
    notice_status     boolean      NOT NULL,
    notice_type       tinyint NOT NULL,
    notice_content    varchar(1000) NOT NULL,
    robot_id          int          NOT NULL
);

CREATE TABLE robot_log
(
    robot_log_id           int PRIMARY KEY AUTO_INCREMENT,
    robot_log_type         tinyint       NOT NULL,
    robot_log_content      varchar(1000) NOT NULL,
    robot_log_created_at   datetime      NOT NULL,
    robot_log_completed_at datetime NULL,
    robot_id               int           NOT NULL
);

CREATE TABLE arrive_zone
(
    arrive_zone_id   int PRIMARY KEY AUTO_INCREMENT,
    arrive_zone_name varchar(100) NOT NULL,
    arrive_zone_book int          NOT NULL,
    arrive_zone_time datetime NULL,
    library_map_id           int          NOT NULL
);

CREATE TABLE library_map
(
    library_map_id        int PRIMARY KEY AUTO_INCREMENT,
    library_map_name      varchar(255) NULL,
    library_map_x         double NULL,
    library_map_y         double NULL,
    library_map_w         double NULL
);

CREATE TABLE salt
(
    user_id int PRIMARY KEY,
    salt    varchar(200) NOT NULL
);

/*
CREATE TABLE token (
	Key	VARCHAR(255)	PRIMARY KEY,
	Field	VARCHAR(255)	NULL,
	Field2	VARCHAR(255)	NULL,
	Field3	VARCHAR(255)	NULL,
	Field4	VARCHAR(255)	NULL
);
*/

ALTER TABLE book
    ADD CONSTRAINT
        FOREIGN KEY (arrive_zone_id) REFERENCES arrive_zone (arrive_zone_id);

ALTER TABLE borrow_record
    ADD CONSTRAINT
        FOREIGN KEY (book_id) REFERENCES book (book_id);

ALTER TABLE borrow_record
    ADD CONSTRAINT
        FOREIGN KEY (user_id) REFERENCES `user` (user_id);

ALTER TABLE notice
    ADD CONSTRAINT
        FOREIGN KEY (robot_id) REFERENCES robot (robot_id);

ALTER TABLE robot_log
    ADD CONSTRAINT
        FOREIGN KEY (robot_id) REFERENCES robot (robot_id);

ALTER TABLE arrive_zone
    ADD CONSTRAINT
        FOREIGN KEY (library_map_id) REFERENCES library_map (library_map_id);

ALTER TABLE salt
    ADD CONSTRAINT
        FOREIGN KEY (user_id) REFERENCES `user` (user_id);