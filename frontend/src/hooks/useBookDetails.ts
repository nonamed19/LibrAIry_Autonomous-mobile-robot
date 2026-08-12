import { useState, useEffect } from "react";
import { fetchBookDetails } from "../services/bookService";
import { fillBookDetailsKakao2 } from "../utils/fillBookDetailsNaver";
import type { DetailedBook } from "../types/book";

export const useBookDetails = (bookId: string) => {
  const [book, setBook] = useState<DetailedBook | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookId) return;

    const fetchDetails = async () => {
      try {
        const response = await fetchBookDetails(bookId);
        if (!response) {
          throw new Error("도서 정보를 찾을 수 없습니다.");
        }

        // 기본 정보 설정
        const initialBookData: Partial<DetailedBook> = {
          id: bookId,
          isbn: response.bookIsbn || "",
          status: response.bookStatus || "상태 정보 없음",
          callNumber: response.bookSign,
          plannedReturnDate: response.bookReturn,
        };

        // 네이버 API 데이터 추가
        const detailedBook = await fillBookDetailsKakao2(initialBookData);
        setBook(detailedBook);
      } catch (err) {
        console.error("도서 상세 정보 조회 실패:", err);
        setError("도서 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [bookId]);

  return { book, loading, error };
};
