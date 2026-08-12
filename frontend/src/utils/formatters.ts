import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (dateString: string): string => {
  try {
    // ISO 날짜 문자열인 경우
    if (dateString.includes("T") || dateString.includes("-")) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}.${month}.${day}`;
    }

    // "YYYYMMDD" 형식인 경우
    if (dateString.length === 8) {
      const year = dateString.slice(0, 4);
      const month = dateString.slice(4, 6);
      const day = dateString.slice(6, 8);
      return `${year}.${month}.${day}`;
    }

    return dateString; // 지원하지 않는 형식인 경우 원본 반환
  } catch (error) {
    console.error("날짜 포맷팅 실패:", error);
    return dateString;
  }
};

export const formatTitle = (title: string): string => {
  const bracketIndex = title.indexOf("(");

  if (bracketIndex === -1) return title;

  return title.substring(0, bracketIndex).trim();
};

export const formatTDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "-"; // 날짜가 없을 경우 대체 문자열 반환
  if (dateString === "-") return dateString; // 날짜가 "-"일 경우 그대로 반환
  return dayjs.utc(dateString).local().format("YYYY-MM-DD HH:mm");
};
