import "../styles/custom.css";
import { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { searchBookService } from "../services/bookService";
import type { BookCardHorizontal } from "../types/book";
import { fillBookDetailsKakao } from "../utils/fillBookDetailsKakao";
import BookCardHorizontalComponent from "../components/common/BookCardHorizontal";
import SearchBarv2 from "../components/common/SearchBarv2";
import { transformBookDtoToBookCardHorizontal } from "../utils/transformers";
import PageHeader from "../components/common/PageHeader";

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
    <div className="page-layout narrow">
      <PageHeader eyebrow="CATALOG SEARCH" title="도서 검색" description="제목, 작가, 출판사 기준으로 도서관 소장 자료를 찾아보세요." />
      <div>
        <SearchBarv2 />
        <div className="mt-8">
          <div className="section-heading"><div><h2><span className="text-primary">'{searchStr}'</span> 검색 결과</h2><p>{results.length}권의 소장 도서를 찾았습니다.</p></div></div>

          {error && <p className="page-feedback">{error}</p>}

          {loading ? (
            // 로딩 중일 때 여러 개의 Skeleton UI 렌더링(예시: 5개)
            <div className="space-y-4">
              {[...Array(5)].map((_, idx) => (
                <BookCardSkeleton key={idx} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="page-empty">조건에 맞는 도서가 없습니다. 다른 검색어 또는 검색 기준을 시도해 보세요.</div>
          ) : (
            <div className="space-y-4">
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
