import { FC, useEffect, useState, useRef } from "react";
import BookCardVertical from "../components/common/BookCardVertical";
import SearchBarv2 from "../components/common/SearchBarv2";
import { bookMostService } from "../services/bookService";
import { fillBookDetailsKakao } from "../utils/fillBookDetailsKakao";
import { useToast } from "../hooks/useToast";
import { useLocation } from "react-router-dom";

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const Home: FC = () => {
  const [weeklyBooks, setWeeklyBooks] = useState<any[]>([]);
  const [monthlyBooks, setMonthlyBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const location = useLocation();
  const toastShownRef = useRef(false);
  const isbnCache = useRef(new Map());

  useEffect(() => {
    if (location.state && !toastShownRef.current) {
      const { message, type } = location.state as {
        message: string;
        type: "success" | "error";
      };
      showToast(message, type);
      toastShownRef.current = true;
    }
  }, [location.state, showToast]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);

      const cachedDataStr = localStorage.getItem("bookCache");
      if (cachedDataStr) {
        try {
          const cachedData = JSON.parse(cachedDataStr);
          const { weeklyBooks, monthlyBooks, timestamp } = cachedData;

          if (
            Array.isArray(weeklyBooks) &&
            Array.isArray(monthlyBooks) &&
            weeklyBooks.length > 0 &&
            monthlyBooks.length > 0 &&
            Date.now() - timestamp < ONE_WEEK_MS
          ) {
            setWeeklyBooks(weeklyBooks);
            setMonthlyBooks(monthlyBooks);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error("Error parsing cached data", error);
        }
      }

      try {
        const [weeklyResponse, monthlyResponse] = await Promise.all([
          bookMostService(0),
          bookMostService(1),
        ]);

        const processBookData = async (book: any) => {
          if (isbnCache.current.has(book.bookIsbn)) {
            return {
              ...isbnCache.current.get(book.bookIsbn),
              id: book.bookId,
              status: book.bookStatus,
            };
          }

          const kakaoBookDetails = await fillBookDetailsKakao({
            isbn: book.bookIsbn,
          });

          const bookData = {
            id: book.bookId,
            isbn: book.bookIsbn,
            status: book.bookStatus,
            title: kakaoBookDetails.title || "제목 없음",
            coverImageUrl: kakaoBookDetails.coverImageUrl || "/placeholder.svg",
          };

          isbnCache.current.set(book.bookIsbn, bookData);
          return bookData;
        };

        const [filledWeeklyBooks, filledMonthlyBooks] = await Promise.all([
          weeklyResponse?.bookRankList
            ? Promise.all(weeklyResponse.bookRankList.map(processBookData))
            : [],
          monthlyResponse?.bookRankList
            ? Promise.all(monthlyResponse.bookRankList.map(processBookData))
            : [],
        ]);

        setWeeklyBooks(filledWeeklyBooks);
        setMonthlyBooks(filledMonthlyBooks);

        const cacheData = {
          weeklyBooks: filledWeeklyBooks,
          monthlyBooks: filledMonthlyBooks,
          timestamp: Date.now(),
        };
        localStorage.setItem("bookCache", JSON.stringify(cacheData));
      } catch (err) {
        console.error("대출 순위 데이터를 가져오는 중 오류 발생:", err);
        setError("대출 순위를 불러오는 중 오류가 발생했습니다.");
        showToast("도서 데이터를 가져오는 중 오류가 발생했습니다.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [showToast]);

  return (
    <div className="min-h-screen bg-snow mt-10">
      <SearchBarv2 />
      <main className="container px-4 py-4 mx-auto bg-snow">
        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <>
            <SkeletonSection title="주간 최다 대출 도서" />
            <SkeletonSection title="월간 최다 대출 도서" />
          </>
        ) : (
          <>
            <BookSection title="주간 최다 대출 도서" books={weeklyBooks} />
            <BookSection title="월간 최다 대출 도서" books={monthlyBooks} />
          </>
        )}
      </main>
    </div>
  );
};

const SkeletonSection: FC<{ title: string }> = ({ title }) => (
  <section className="mb-10">
    <h2 className="pb-1 mb-4 text-2xl font-semibold text-primary">{title}</h2>
    <div className="flex pb-4 space-x-4 overflow-x-auto">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-40 h-56 bg-gray-200 animate-pulse rounded-lg"
        />
      ))}
    </div>
  </section>
);

const BookSection: FC<{ title: string; books: any[] }> = ({ title, books }) => (
  <section className="mb-10">
    <h2 className="pb-1 mb-4 text-2xl font-semibold text-primary">{title}</h2>
    <div className="flex pb-4 space-x-4 overflow-x-auto">
      {books.map((book) => (
        <div key={book.id} className="flex-shrink-0">
          <BookCardVertical
            id={book.id}
            isbn={book.isbn}
            title={book.title}
            coverImageUrl={book.coverImageUrl}
            status={book.status}
          />
        </div>
      ))}
    </div>
  </section>
);

export default Home;
