import { FC, useEffect, useState, useRef } from "react";
import BookCardVertical from "../components/common/BookCardVertical";
import SearchBarv2 from "../components/common/SearchBarv2";
import { bookMostService } from "../services/bookService";
import { fillBookDetailsKakao } from "../utils/fillBookDetailsKakao";
import { useToast } from "../hooks/useToast";
import { useLocation } from "react-router-dom";
import type { BookRankDto } from "../backapi/data-contracts";
import type { BookCardVertical as BookCardVerticalProps } from "../types/book";
import { ArrowRight, Bot, QrCode, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

type RankedBook = Required<
  Pick<BookCardVerticalProps, "isbn" | "title" | "coverImageUrl">
> &
  Pick<BookCardVerticalProps, "id" | "status">;

const Home: FC = () => {
  const [weeklyBooks, setWeeklyBooks] = useState<RankedBook[]>([]);
  const [monthlyBooks, setMonthlyBooks] = useState<RankedBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { isAdmin } = useAuth();
  const location = useLocation();
  const toastShownRef = useRef(false);
  const isbnCache = useRef<Map<string, RankedBook>>(new Map());

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
        } catch {
          localStorage.removeItem("bookCache");
        }
      }

      try {
        const [weeklyResponse, monthlyResponse] = await Promise.all([
          bookMostService(0),
          bookMostService(1),
        ]);

        const processBookData = async (book: BookRankDto): Promise<RankedBook> => {
          const isbn = book.bookIsbn ?? "";
          const cachedBook = isbnCache.current.get(isbn);
          if (cachedBook) {
            return {
              ...cachedBook,
              id: book.bookId,
              status: book.bookStatus,
            };
          }

          const kakaoBookDetails = await fillBookDetailsKakao({
            isbn,
          });

          const bookData: RankedBook = {
            id: book.bookId,
            isbn,
            status: book.bookStatus,
            title: kakaoBookDetails.title || "제목 없음",
            coverImageUrl: kakaoBookDetails.coverImageUrl || "/placeholder.svg",
          };

          isbnCache.current.set(isbn, bookData);
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
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="hero-kicker"><Sparkles size={15} /> AI-POWERED LIBRARY SERVICE</p>
          <h1>찾고, 빌리고, 반납하는<br />도서관 경험을 더 매끄럽게.</h1>
          <p>도서 검색부터 모바일 회원증, 자율주행 로봇 서비스까지<br className="hidden sm:block" /> LibrAIry에서 한 번에 이용하세요.</p>
        </div>
        <div className="home-search"><SearchBarv2 /></div>
        <div className="home-quick-links">
          <Link to="/qrcode"><QrCode /><span><b>모바일 회원증</b><small>QR 코드로 빠르게 대출</small></span><ArrowRight size={18} /></Link>
          <Link to={isAdmin ? "/admin/robot" : "/bookshelf"}><Bot /><span><b>{isAdmin ? "로봇 운영 현황" : "나의 대출 현황"}</b><small>{isAdmin ? "자율주행 서비스 확인" : "대출·반납 기록 확인"}</small></span><ArrowRight size={18} /></Link>
        </div>
      </section>

      <section className="home-content">
        {error && <div className="home-error">{error}</div>}
        {loading ? (
          <><SkeletonSection title="이번 주 가장 많이 읽은 책" /><SkeletonSection title="이달의 인기 도서" /></>
        ) : (
          <><BookSection title="이번 주 가장 많이 읽은 책" caption="지난 7일 기준 대출 순위" books={weeklyBooks} /><BookSection title="이달의 인기 도서" caption="이번 달 누적 대출 순위" books={monthlyBooks} /></>
        )}
      </section>
    </div>
  );
};

const SkeletonSection: FC<{ title: string }> = ({ title }) => (
  <section className="home-book-section">
    <div className="section-heading"><div><h2>{title}</h2><p>도서 데이터를 불러오는 중입니다.</p></div></div>
    <div className="home-book-row">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-40 h-56 bg-gray-200 animate-pulse rounded-lg"
        />
      ))}
    </div>
  </section>
);

const BookSection: FC<{ title: string; caption: string; books: RankedBook[] }> = ({ title, caption, books }) => (
  <section className="home-book-section">
    <div className="section-heading"><div><h2>{title}</h2><p>{caption}</p></div><span>{books.length}권</span></div>
    <div className="home-book-row">
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
