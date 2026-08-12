import type { BookCardHorizontal } from "../types/book";
import type { BookCardVertical } from "../types/book";
import { User } from "../types/user";
import {
  UserLoginResponseDto,
  BookFrontResponseDto,
} from "../backapi/data-contracts";

// 백엔드 응답을 User 타입으로 변환하는 함수
export const mapUserLoginResponseToUser = (
  response: UserLoginResponseDto
): User => {
  return {
    userId: response.userId!,
    userName: response.userName!,
    isAdmin: response.userId! >= 1 && response.userId! <= 5,
  };
};

export const transformBookDtoToBookCardHorizontal = (dto: {
  bookId?: string;
  bookIsbn?: string;
  bookStatus?: string;
  bookSign?: string;
  bookReturn?: string;
}): Partial<BookCardHorizontal> => ({
  id: dto.bookId || "",
  isbn: dto.bookIsbn || "",
  title: "", // Kakao API로 채워질 예정
  writer: "", // Kakao API로 채워질 예정
  status: dto.bookStatus,
  callNumber: dto.bookSign,
  plannedReturnDate: dto.bookReturn,
});

export const transformBookDtoToBookCardVertical = (dto: {
  bookId?: string;
  bookIsbn?: string;
  bookStatus?: string;
}): Partial<BookCardVertical> => ({
  id: dto.bookId || "",
  isbn: dto.bookIsbn || "",
  title: "",
  status: dto.bookStatus,
});

// 백엔드 응답을 BookCardVertical 타입으로 변환하는 함수
export const mapToBookCardVertical = (
  book: BookFrontResponseDto
): Partial<BookCardVertical> => ({
  id: book.bookId || "",
  isbn: book.bookIsbn || "",
  title: "정보 없음", // 없으면 나중에 네이버로 채움
  coverImageUrl: "",
  status: book.bookStatus || "정보 없음",
});
