import { FC, useState } from "react";
import { DetailedBook } from "../../types/book";
import {
  updateBookService,
  deleteBookService,
} from "../../services/bookService";
import { useToast } from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";

const BookEditForm: FC<{
  book: DetailedBook;
  setIsEditing: (value: boolean) => void;
}> = ({ book, setIsEditing }) => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const apiTitle = book.title; // Title from External API
  const bookDescription = book.description; // API Fetched Description

  const [bookId, setBookId] = useState<string>(book.id ?? "");
  const [bookIsbn, setBookIsbn] = useState(book.isbn || "");
  const [bookTitle, setBookTitle] = useState(book.title);
  const [bookWriter, setBookWriter] = useState(book.writer);
  const [bookPublisher, setBookPublisher] = useState(book.publisher || "");
  const [bookSign, setBookSign] = useState(book.callNumber || "");
  const [arriveZoneName, setArriveZoneName] = useState(
    book.arriveZoneName || "문학"
  );
  const [bookStatus, setBookStatus] = useState<number>(
    Number(book.status) || 0
  );

  const handleSave = async () => {
    try {
      const response = await updateBookService({
        bookId,
        bookTitle,
        bookIsbn,
        bookWriter,
        bookPublisher,
        bookStatus,
        bookSign,
        arriveZoneName,
        action: 1,
      });

      if (response && response.isDone) {
        showToast("도서 정보가 수정되었습니다.", "success");
        setIsEditing(false);
      } else {
        showToast("도서 수정에 실패했습니다.", "error");
      }
    } catch (error) {
      showToast("서버 오류가 발생했습니다.", "error");
    }
  };
  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말로 이 도서를 삭제하시겠습니까?");

    if (confirmDelete) {
      try {
        const response = await deleteBookService({ bookId });

        if (response && response.isDone) {
          showToast("도서가 삭제되었습니다.", "success");
          setTimeout(() => {
            navigate("/");
          }, 2000);
          setIsEditing(false);
        } else {
          showToast("도서 삭제에 실패했습니다.", "error");
        }
      } catch (error) {
        showToast("서버 오류가 발생했습니다.", "error");
      }
    }
  };
  return (
    <div className="p-6 bg-snow rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">도서 수정</h2>

      <p className="text-gray-700 font-medium">공식 제목: {apiTitle}</p>
      <p className="text-gray-700 font-medium">책 소개: {bookDescription}</p>

      <label className="block mt-4 text-gray-700 font-medium">도서 ID</label>
      <input
        type="text"
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
        className="w-full mb-3 p-2 border rounded  border-gray-300"
      />

      <label className="block text-gray-700 font-medium">ISBN</label>
      <input
        type="text"
        value={bookIsbn}
        onChange={(e) => setBookIsbn(e.target.value)}
        className="w-full mb-3 p-2 border rounded  border-gray-300"
      />

      <label className="block text-gray-700 font-medium">
        도서 제목 (등록한 제목)
      </label>
      <input
        type="text"
        value={bookTitle}
        onChange={(e) => setBookTitle(e.target.value)}
        className="w-full mb-3 p-2 border rounded  border-gray-300"
      />

      <label className="block text-gray-700 font-medium">저자</label>
      <input
        type="text"
        value={bookWriter}
        onChange={(e) => setBookWriter(e.target.value)}
        className="w-full mb-3 p-2 border rounded  border-gray-300"
      />

      <label className="block text-gray-700 font-medium">출판사</label>
      <input
        type="text"
        value={bookPublisher}
        onChange={(e) => setBookPublisher(e.target.value)}
        className="w-full mb-3 p-2 border rounded  border-gray-300"
      />

      <label className="block text-gray-700 font-medium">도서 상태</label>
      <select
        value={bookStatus}
        onChange={(e) => setBookStatus(parseInt(e.target.value, 10))}
        className="w-full mb-3 p-2 border  border-gray-300 rounded"
      >
        <option value="">도서 상태 선택</option>
        <option value={0}>대출 가능</option>
        <option value={1}>대출 중</option>
        <option value={2}>정리 중</option>
      </select>

      <label className="block text-gray-700 font-medium">청구기호</label>
      <input
        type="text"
        value={bookSign}
        onChange={(e) => setBookSign(e.target.value)}
        className="w-full mb-3 p-2 border  border-gray-300 rounded"
      />

      <label className="block text-gray-700 font-medium">회수 구역</label>
      <select
        id="arriveZoneName"
        defaultValue="문학"
        onChange={(e) => setArriveZoneName(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      >
        <option value="">회수 구역 선택</option>
        <option value="총류">총류</option>
        <option value="철학">철학</option>
        <option value="종교">종교</option>
        <option value="사회과학">사회과학</option>
        <option value="자연과학">자연과학</option>
        <option value="기술과학">기술과학</option>
        <option value="예술">예술</option>
        <option value="언어">언어</option>
        <option value="문학">문학</option>
        <option value="역사">역사</option>
      </select>

      <div className="flex mt-4">
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={() => setIsEditing(false)}
        >
          취소
        </button>{" "}
        <div className="ml-auto flex space-x-4">
          {" "}
          {/* 오른쪽에 배치되는 버튼들 */}
          <button
            className="px-4 py-2 bg-blue text-white rounded hover:bg-blue-hover"
            onClick={handleDelete}
          >
            삭제
          </button>
          <button
            className="px-4 py-2 bg-orange text-white rounded hover:bg-orange-hover"
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookEditForm;
