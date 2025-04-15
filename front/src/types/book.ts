// 기본 도서 정보 인터페이스
export interface BookBase {
  id?: string; // 책 고유 식별자 (book id)
  isbn: string; // ISBN 번호
  title: string; // 책 제목
  coverImageUrl: string; // 책 표지 URL (필수 또는 옵션)
}

export interface BookCardVertical extends BookBase {
  status?: string;
}

export interface BookCardHorizontal extends BookBase {
  writer?: string;
  status?: string;
  callNumber?: string; // 검색 결과 페이지에서 사용
  borrowAt?: string; // 내 책장 페이지: 대출일 (ISO 날짜 문자열)
  returnAt?: string; // 내 책장 페이지: 반납일 (ISO 날짜 문자열)
  plannedReturnDate?: string; // 대출 현황 페이지: 반납 예정일 (ISO 날짜 문자열)
  disableClick?: boolean; // 클릭 비활성화 여부
}

export interface DetailedBook extends BookBase {
  writer: string;
  publisher?: string;
  publishDate?: string; // ISO 날짜 문자열 (출판일)
  callNumber?: string;
  plannedReturnDate?: string; // 반납 예정일 (ISO 날짜 문자열)
  description?: string;
  status: string;
  arriveZoneName?: string;
}
