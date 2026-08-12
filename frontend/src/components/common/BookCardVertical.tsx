import { FC } from "react";
import type { BookCardVertical } from "../../types/book";
import { useNavigate } from "react-router-dom";

const BookCardVertical: FC<BookCardVertical> = ({
  id,
  coverImageUrl,
  title,
  status,
}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/book/${id}`);
  };

  return (
    <div className="w-36 p-2" onClick={handleClick}>
      <div className="transition-shadow duration-300 ease-in-out bg-white shadow-md rounded-xl hover:shadow-lg">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={title}
            className="object-cover w-full aspect-[2/3] mb-2 rounded-lg"
          />
        ) : (
          <div className="flex items-center justify-center w-full aspect-[2/3] mb-2 bg-gray-300 rounded-lg">
            <span className="text-gray-600">No Image</span>
          </div>
        )}
      </div>

      <h3
        className="mb-2 text-lg font-bold truncate w-full overflow-hidden whitespace-nowrap"
        style={{ maxWidth: "100%" }}
        title={title}
      >
        {title}
      </h3>

      {status && (
        <p
          className={
            status === "대출 가능"
              ? "text-blue font-bold"
              : "text-primary font-bold"
          }
        >
          {status}
        </p>
      )}
    </div>
  );
};

export default BookCardVertical;
