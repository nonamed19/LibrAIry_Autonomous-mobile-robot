import { BookCardVertical } from "../types/book";

export function isBookCardVertical(
  book: Partial<BookCardVertical>
): book is BookCardVertical {
  return (
    typeof book.isbn === "string" &&
    typeof book.title === "string" &&
    typeof book.coverImageUrl === "string"
  );
}

export const isValidPassword = (password: string): boolean => {
  // 최소 8자 이상, 하나 이상의 특수문자, 숫자, 대문자 포함
  const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password);
};

export const isValidName = (name: string): boolean => {
  // 한글, 영문만 허용 (공백 포함)
  const nameRegex = /^[가-힣a-zA-Z\s]+$/;
  return nameRegex.test(name);
};
