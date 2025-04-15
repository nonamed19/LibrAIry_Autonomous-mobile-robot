import { FC } from "react";
import type { BookCardHorizontal } from "../../types/book";
import { useNavigate } from "react-router-dom";

const BookCardHorizontal: FC<BookCardHorizontal> = ({
  id,
  coverImageUrl,
  title,
  writer,
  status,
  callNumber,
  borrowAt,
  returnAt,
  plannedReturnDate,
  disableClick,
}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (disableClick) return;
    navigate(`/book/${id}`);
  };
  return (
    <div
      className="flex w-full max-w-2xl p-6 transition-shadow duration-300 ease-in-out bg-white shadow-md rounded-xl hover:shadow-lg"
      onClick={handleClick}
    >
      <div className="flex-shrink-0 w-24 mr-6 h-36">
        {coverImageUrl ? (
          <img
            src={coverImageUrl || "/placeholder.svg"}
            alt={title}
            className="object-cover w-full h-full rounded-lg"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-lg">
            <span className="text-sm text-gray-400">No Image</span>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between flex-grow">
        <div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>
          {writer && (
            <p className="mb-2 font-semibold text-gray-600 text-m">{writer}</p>
          )}
          {status && (
            <p className="mb-1 text-sm font-medium">
              <span>도서상태 </span>
              <span
                className={
                  ["대출 가능", "반납 완료"].includes(status)
                    ? "text-blue font-bold"
                    : "text-primary font-bold"
                }
              >
                {status}
              </span>
            </p>
          )}
          {callNumber && (
            <p className="mb-1 text-sm text-gray-600">청구기호 {callNumber}</p>
          )}
          {borrowAt && (
            <p className="mb-1 text-sm text-gray-600">대출일 {borrowAt}</p>
          )}
          {plannedReturnDate && (
            <p className="mb-1 text-sm text-gray-600">
              반납 예정일 {plannedReturnDate}
            </p>
          )}
          {returnAt && (
            <p className="mb-1 text-sm text-gray-600">반납일 {returnAt}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCardHorizontal;
