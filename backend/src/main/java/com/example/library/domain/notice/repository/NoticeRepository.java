package com.example.library.domain.notice.repository;

import com.example.library.domain.notice.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface NoticeRepository extends JpaRepository<Notice, Integer> {

    @Query("SELECT COUNT(*) FROM Notice n WHERE n.noticeStatus = true")
    int countUnreadNotice();
}
