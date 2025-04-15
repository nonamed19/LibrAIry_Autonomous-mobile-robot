import { Api } from "../backapi/Api";
import type {
  NoticeDeleteRequestDto,
  NoticeDeleteResponseDto,
  NoticeResponseDto,
  NewNoticeResponseDto,
} from "../backapi/data-contracts";

const api = new Api();

/** 알림 리스트 조회 */
export const fetchNoticeList = async (): Promise<NoticeResponseDto | null> => {
  try {
    const response = await api.showNoticeList();
    return response.data;
  } catch (error) {
    console.error("알림 리스트 조회 실패:", error);
    return null;
  }
};

/** 알림 삭제 */
export const deleteNoticeService = async (
  data: NoticeDeleteRequestDto
): Promise<NoticeDeleteResponseDto | null> => {
  try {
    const response = await api.deleteNotice(data);
    return response.data;
  } catch (error) {
    console.error("알림 삭제 실패:", error);
    return null;
  }
};

/** 읽지 않은 알림 개수 조회 */
export const checkUnreadNoticeService =
  async (): Promise<NewNoticeResponseDto | null> => {
    try {
      const response = await api.checkUnreadNotice();
      return response.data;
    } catch (error) {
      console.error("읽지 않은 알림 개수 조회 실패:", error);
      return null;
    }
  };
