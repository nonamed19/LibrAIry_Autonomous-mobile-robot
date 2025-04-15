import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import { useBookDetails } from "../hooks/useBookDetails";
import { formatDate } from "../utils/formatters";
import { DetailedBook } from "../types/book";
import { useAuth } from "../hooks/useAuth";
import BookEditForm from "../components/admin/BookEditForm";

const LoadingState: FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div role="status">
      <svg
        aria-hidden="true"
        className="w-12 h-12 text-gray-200 animate-spin fill-primary"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591
             C22.3858 100.591 0 78.2051 0 50.5908
             C0 22.9766 22.3858 0.59082 50 0.59082
             C77.6142 0.59082 100 22.9766 100 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539
             C95.2932 28.8227 92.871 24.3692 89.8167 20.348
             C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289
             C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124
             C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873
             C39.2613 1.69328 37.813 4.19778 38.4501 6.62326
             C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071
             C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491
             C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552
             C75.2735 17.9648 79.3347 21.5619 82.5849 25.841
             C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758
             C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

const ErrorState: FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-lg text-red-500">{message}</div>
  </div>
);

const NotFoundState: FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-lg text-gray-600">도서 정보를 찾을 수 없습니다.</div>
  </div>
);

const BookDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { book, loading, error } = useBookDetails(id || "");
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!book) return <NotFoundState />;

  return (
    <div className="relative min-h-screen p-4 overflow-hidden bg-transparent mt-10 sm:p-6 lg:p-8">
      <BlurryBackground imageUrl={book.coverImageUrl} />

      <div className="container relative z-10 mx-auto">
        <div className="md:flex md:items-center md:space-x-6">
          <BookCover imageUrl={book.coverImageUrl} title={book.title} />

          <div className="w-full overflow-hidden transition-all duration-300 bg-white shadow-xl backdrop-blur-md rounded-xl hover:shadow-xl">
            {isEditing ? (
              <BookEditForm book={book} setIsEditing={setIsEditing} />
            ) : (
              <BookInfo book={book} />
            )}
          </div>
        </div>

        {user?.isAdmin && (
          <div className="mt-4 flex items-center justify-center space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors  ${
                isEditing ? "bg-orange" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isEditing ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm font-medium text-gray-700">
              {isEditing ? "수정 모드" : "보기 모드"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const BlurryBackground: FC<{ imageUrl: string }> = ({ imageUrl }) => (
  <div
    className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-50 blur-xl"
    style={{ backgroundImage: `url(${imageUrl})` }}
  />
);

const BookCover: FC<{ imageUrl: string; title: string }> = ({
  imageUrl,
  title,
}) => (
  <div className="flex items-center justify-center p-8 md:w-2/5 lg:w-1/3">
    <div className="w-full max-w-[300px] md:max-w-none aspect-[3/4] rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-white">
          <span className="text-gray-500"></span>
        </div>
      )}
    </div>
  </div>
);

const BookInfo: FC<{ book: DetailedBook }> = ({ book }) => {
  return (
    <div className="p-9 md:p-8">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">{book.title}</h1>
      <p className="mb-2 text-xl font-semibold text-gray-800">{book.writer}</p>
      {(book.publisher || book.publishDate) && (
        <p className="mb-4 text-sm text-gray-600">
          {book.publisher}
          {book.publisher && book.publishDate && " · "}
          {book.publishDate && formatDate(book.publishDate)}
        </p>
      )}
      <div className="mb-6 space-y-2">
        <p className="mb-2 font-semibold text-gray-700 text-l">소장 정보</p>
        {book.callNumber && (
          <InfoItem label="청구기호" value={book.callNumber} />
        )}
        <InfoItem
          label="도서상태"
          value={book.status}
          className={
            book.status === "대출 가능"
              ? "text-blue font-bold"
              : "text-primary font-bold"
          }
        />
        <InfoItem label="등록번호" value={book.id ?? "정보 없음"} />
        {book.plannedReturnDate && (
          <InfoItem
            label="반납예정일"
            value={formatDate(book.plannedReturnDate)}
          />
        )}
      </div>

      {book.description && (
        <div className="mt-8">
          <h2 className="mb-2 font-semibold text-gray-700 text-l">책 소개</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            {book.description}
          </p>
        </div>
      )}
    </div>
  );
};

const InfoItem: FC<{ label: string; value: string; className?: string }> = ({
  label,
  value,
  className,
}) => (
  <p className="text-sm">
    <span className="mr-2 font-medium text-gray-600">{label}:</span>
    <span className={className || "text-gray-800"}>{value}</span>
  </p>
);

export default BookDetail;
