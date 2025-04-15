import "../styles/custom.css";
import { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { searchBookService } from "../services/bookService";
import type { BookCardHorizontal } from "../types/book";
import { fillBookDetailsKakao } from "../utils/fillBookDetailsKakao";
import BookCardHorizontalComponent from "../components/common/BookCardHorizontal";
import SearchBarv2 from "../components/common/SearchBarv2";
import { transformBookDtoToBookCardHorizontal } from "../utils/transformers";

const BookCardSkeleton: FC = () => {
  return (
    <div className="flex p-6 space-x-4 border border-gray-200 rounded-lg animate-pulse">
      <div className="w-24 h-32 bg-gray-300 rounded"></div>
      <div className="flex-1 py-1 space-y-4">
        <div className="w-3/4 h-6 bg-gray-300 rounded"></div>
        <div className="h-6 bg-gray-300 rounded"></div>
        <div className="w-5/6 h-6 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

const SearchResults: FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchStr = queryParams.get("query") || "";
  const action = Number(queryParams.get("action")) || 0;

  const [results, setResults] = useState<BookCardHorizontal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchStr) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await searchBookService(searchStr, action);
        if (response?.bookList && response.bookList.length > 0) {
          const transformedBooks = response.bookList.map(
            transformBookDtoToBookCardHorizontal
          );
          const filledBooks = await Promise.all(
            transformedBooks.map((book) => fillBookDetailsKakao(book))
          );
          setResults(filledBooks);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("도서 검색 실패:", err);
        setError("도서 검색 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchStr, action]);

  return (
    <div>
      <div className="min-h-screen pt-10">
        <SearchBarv2 />
        <div className="container max-w-2xl px-4 mx-auto">
          <h2 className="mt-6 mb-2 text-2xl font-bold">
            <span className="font-bold text-primary">'{searchStr}'</span>
            <span>에 대한 검색 결과</span>
          </h2>

          {error && <p className="text-red-500">{error}</p>}

          {loading ? (
            // 로딩 중일 때 여러 개의 Skeleton UI 렌더링(예시: 5개)
            <div className="space-y-6 ">
              {[...Array(5)].map((_, idx) => (
                <BookCardSkeleton key={idx} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <p className="text-gray-600">검색 결과가 없습니다.</p>
          ) : (
            <div className="space-y-6">
              {results.map((book) => (
                <BookCardHorizontalComponent key={book.id} {...book} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
