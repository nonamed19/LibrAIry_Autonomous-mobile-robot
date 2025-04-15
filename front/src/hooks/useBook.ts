// src/hooks/useBook.ts
import { useState, useEffect } from "react";
import { searchBookService } from "../services/bookService";
import type { BookCardHorizontal } from "../types/book";
import { fillBookDetailsKakao } from "../utils/fillBookDetailsKakao";
import { transformBookDtoToBookCardHorizontal } from "../utils/transformers";

/*
  백엔드 API의 BookDto (data-contracts에서 정의된 타입)는 아래와 같은 속성을 가집니다.
  이를 프론트엔드 타입(BookCardHorizontal)으로 변환하기 위한 헬퍼 함수를 작성합니다.
*/
interface BookDto {
  bookId?: string;
  bookIsbn?: string;
  bookStatus?: string;
  bookSign?: string;
  bookReturn?: string;
  arriveZoneName?: string;
}

/**
 * useBook hook은 검색어(searchString)와 검색 조건(action)을 받아,
 * 백엔드 도서 검색 API(searchBookService)를 호출합니다.
 *
 * 각 BookDto를 transformBookDtoToBookCardHorizontal 함수로 BookCardHorizontal의 partial로 변환한 후,
 * fillBookDetails 함수를 통해 Kakao Book API 등으로 누락 정보를 보충합니다.
 *
 * 반환값은 { books, loading, error }입니다.
 */
export const useBook = (searchString: string, action: number = 0) => {
  const [books, setBooks] = useState<BookCardHorizontal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchString) {
      setBooks([]);
      return;
    }
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        // 백엔드 API 호출: searchBookService는 BookSearchResponseDto를 반환
        const response = await searchBookService(searchString, action);
        if (response && response.bookList && response.bookList.length > 0) {
          const transformedBooks = response.bookList.map((dto: BookDto) =>
            transformBookDtoToBookCardHorizontal(dto)
          );
          // 각 책 정보에 대해 fillBookDetails를 통해 누락된 정보를 보충 (예: 표지 이미지)
          const filledBooks = await Promise.all(
            transformedBooks.map(async (book) =>
              fillBookDetailsKakao<BookCardHorizontal>(book)
            )
          );
          setBooks(filledBooks);
        } else {
          setBooks([]);
        }
      } catch (err) {
        console.error("도서 검색 실패:", err);
        setError("도서 검색 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [searchString, action]);

  return { books, loading, error };
};
