import axios from "axios";
import type { DetailedBook } from "../types/book";
import { formatTitle } from "./formatters";

export const fillBookDetailsKakao2 = async <T extends DetailedBook>(
  bookData: Partial<T>
): Promise<T> => {
  const data = { ...bookData };

  if (!data.coverImageUrl && data.isbn) {
    try {
      const response = await axios.get(
        "https://dapi.kakao.com/v3/search/book",
        {
          params: { target: "isbn", query: data.isbn },
          headers: {
            Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_API_KEY}`,
          },
        }
      );

      const kakaoData = response.data.documents[0]; // 첫 번째 검색 결과 사용

      if (kakaoData) {
        data.coverImageUrl = kakaoData.thumbnail || "";
        data.title = formatTitle(kakaoData.title);
        data.writer = kakaoData.authors?.join(", ") || "저자 정보 없음";
        data.publisher = kakaoData.publisher || "출판사 정보 없음";
        data.description = kakaoData.contents || "도서 소개가 없습니다.";
        data.publishDate =
          kakaoData.datetime?.split("T")[0] || "출판일 정보 없음";
      }
    } catch (error) {
      console.error("카카오 API(네이버) 호출 실패:", error);
    }
  }

  return data as T;
};
