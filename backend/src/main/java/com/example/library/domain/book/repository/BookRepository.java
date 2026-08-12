package com.example.library.domain.book.repository;

import com.example.library.domain.book.entity.Book;
import java.util.List;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BookRepository extends JpaRepository<Book, String> {

    @Query("SELECT b FROM Book b WHERE b.bookTitle LIKE CONCAT('%', :searchString, '%')")
    List<Book> searchByBookTitle(@Param("searchString") String searchString);

    @Query("SELECT b FROM Book b WHERE b.bookWriter LIKE CONCAT('%', :searchString, '%')")
    List<Book> searchByBookWriter(@Param("searchString") String searchString);

    @Query("SELECT b FROM Book b WHERE b.bookPublisher LIKE CONCAT('%', :searchString, '%')")
    List<Book> searchByBookPublisher(@Param("searchString") String searchString);

    @Query("SELECT b FROM Book b WHERE b.bookId LIKE CONCAT('%', :searchString, '%')")
    List<Book> searchByBookId(@Param("searchString") String searchString);
}
