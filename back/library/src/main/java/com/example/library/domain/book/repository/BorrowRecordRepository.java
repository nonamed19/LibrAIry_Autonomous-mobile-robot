package com.example.library.domain.book.repository;

import com.example.library.domain.book.entity.BorrowRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Integer> {

}
