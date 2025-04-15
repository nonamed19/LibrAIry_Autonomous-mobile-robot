import { Api } from "../backapi/Api";
import type {
  BookUpdateRequestDto,
  BookUpdateResponseDto,
  BookDeleteRequestDto,
  BookDeleteResponseDto,
  BookBorrowRequestDto,
  BookBorrowResponseDto,
  BookSearchResponseDto,
  BookFrontRequestDto,
  BookInfoFrontData,
  BookDetailResponseDto,
  BookMostListResponseDto,
} from "../backapi/data-contracts";

const api = new Api();

/** 도서 정보 등록/수정 */
export const updateBookService = async (
  data: BookUpdateRequestDto
): Promise<BookUpdateResponseDto | null> => {
  try {
    const response = await api.updateBook(data);
    return response.data;
  } catch (error) {
    console.error("도서 등록/수정 실패:", error);
    return null;
  }
};

/** 도서 삭제 */
export const deleteBookService = async (
  data: BookDeleteRequestDto
): Promise<BookDeleteResponseDto | null> => {
  try {
    const response = await api.deleteBook(data);
    return response.data;
  } catch (error) {
    console.error("도서 삭제 실패:", error);
    return null;
  }
};

/** 도서 대출 */
export const borrowBookService = async (
  data: BookBorrowRequestDto
): Promise<BookBorrowResponseDto | null> => {
  try {
    const response = await api.borrowBook(data);
    return response.data;
  } catch (error) {
    console.error("도서 대출 실패:", error);
    return null;
  }
};

/**
 * 대출하려는 도서 정보를 요청하는 서비스
 */
export const fetchBookInfoFront = async (
  payload: BookFrontRequestDto
): Promise<BookInfoFrontData | null> => {
  try {
    const response = await api.bookInfoFront(payload);
    return response.data;
  } catch (error) {
    console.error("대출 도서 정보 요청 실패:", error);
    return null;
  }
};

/** 도서 상세 정보 조회 */
export const fetchBookDetails = async (
  bookId: string
): Promise<BookDetailResponseDto | null> => {
  try {
    const response = await api.getBookDetail({ bookId });
    return response.data;
  } catch (error) {
    console.error("도서 상세 정보 조회 실패:", error);
    return null;
  }
};

/** 도서 검색 (검색 결과 페이지 등) */
export const searchBookService = async (
  searchString: string,
  action: number
): Promise<BookSearchResponseDto | null> => {
  try {
    const response = await api.searchBook1({ searchString, action });
    return response.data;
  } catch (error) {
    console.error("도서 검색 실패:", error);
    return null;
  }
};

/** 대출 순위(주간/월간) 조회 */
export const bookMostService = async (
  action: number
): Promise<BookMostListResponseDto | null> => {
  try {
    const response = await api.bookMost({ action });
    return response.data;
  } catch (error) {
    console.error("대출 순위 조회 실패:", error);
    return null;
  }
};
