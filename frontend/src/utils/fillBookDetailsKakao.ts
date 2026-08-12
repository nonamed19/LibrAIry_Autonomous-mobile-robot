import axios from "axios";
import { BookBase } from "../types/book";

export const fillBookDetailsKakao = async <T extends BookBase>(
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

      const kakaoData = response.data.documents[0];

      if (kakaoData) {
        data.coverImageUrl = kakaoData.thumbnail;
        if (!data.title) data.title = kakaoData.title;
        if ("writer" in data) {
          data.writer = kakaoData.authors?.join(", ");
        }
      }
    } catch (error) {
      console.error("카카오 API 호출 실패:", error);
    }
  }

  return data as T;
};
