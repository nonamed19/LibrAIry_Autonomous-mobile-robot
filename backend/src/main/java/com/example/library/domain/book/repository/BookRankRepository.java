package com.example.library.domain.book.repository;

import com.example.library.domain.book.entity.BookRank;
import jakarta.transaction.Transactional;
import java.util.List;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface BookRankRepository extends JpaRepository<BookRank, Integer> {

    @Query("SELECT br FROM BookRank br WHERE br.rankingPeriod = :rankPeriod")
    List<BookRank> findAllByRankPeriod(@Param("rankPeriod") int rankPeriod);

    @Modifying
    @Transactional
    @Query(value = "CALL get_weekly_top_books()", nativeQuery = true)
    void updateWeeklyTopBooks();

    @Modifying
    @Transactional
    @Query(value = "CALL get_monthly_top_books()", nativeQuery = true)
    void updateMonthlyTopBooks();
}
