import { FC, useEffect, useState } from "react";
import { fetchUserRecords } from "../services/userService";
import { fillBookDetailsKakao } from "../utils/fillBookDetailsKakao";
import { transformBookDtoToBookCardHorizontal } from "../utils/transformers";
import BookCardHorizontalComponent from "../components/common/BookCardHorizontal";
import { useAuth } from "../hooks/useAuth";
import dayjs from "dayjs";
import { formatTDate } from "../utils/formatters";

const MyBookShelf: FC = () => {
  const [bookRecords, setBookRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    let isMounted = true;

    const fetchAndTransformRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        const records = (await fetchUserRecords()) || [];
        if (!isMounted) return;
        const transformedBooks = await Promise.all(
          records.map(async (record) => {
            const transformed = transformBookDtoToBookCardHorizontal(record);
            const filledBook = await fillBookDetailsKakao(transformed);

            return {
              ...filledBook,
              id: record.bookIsbn || "",
              status: record.status || "-",
              borrowAt: record.borrowAt || "-",
              returnAt: record.returnAt || "-",
            };
          })
        );

        const sortedBooks = transformedBooks.sort((a, b) => {
          const dateA = dayjs(a.borrowAt === "-" ? 0 : a.borrowAt);
          const dateB = dayjs(b.borrowAt === "-" ? 0 : b.borrowAt);
          return dateB.diff(dateA);
        });

        if (isMounted) {
          setBookRecords(sortedBooks);
        }
      } catch (err) {
        console.error("도서 기록 조회 실패:", err);
        if (isMounted) setError("도서 기록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAndTransformRecords();
    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <div>
      <div className="min-h-screen pt-10">
        <div className="container max-w-2xl px-4 mx-auto">
          {" "}
          {error && <p className="text-primary">{error}</p>}
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex p-6 space-x-4 border border-gray-200 rounded-lg animate-pulse"
                >
                  <div className="w-24 h-32 bg-gray-300 rounded"></div>
                  <div className="flex-1 py-1 space-y-4">
                    <div className="w-3/4 h-6 bg-gray-300 rounded"></div>
                    <div className="h-6 bg-gray-300 rounded"></div>
                    <div className="w-5/6 h-6 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : bookRecords.length === 0 ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <p className="text-gray-600 text-lg font-semibold">
                아직 도서관 이용 내역이 없습니다.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {bookRecords.map((book) => (
                <BookCardHorizontalComponent
                  key={`${book.id}-${book.borrowAt}-${book.returnAt}`}
                  {...book}
                  borrowAt={formatTDate(book.borrowAt)}
                  returnAt={formatTDate(book.returnAt)}
                  disableClick={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookShelf;
