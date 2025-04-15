import { Api } from "../backapi/Api";
import type {
  ArriveZoneResetRequestDto,
  ArriveZoneResetResponseDto,
  ArriveZoneResponseDto,
} from "../backapi/data-contracts";

const api = new Api();

/** 회수 구역 상태 조회 */
export const fetchArriveZoneInfo =
  async (): Promise<ArriveZoneResponseDto | null> => {
    try {
      const response = await api.arriveZoneInfo();
      const filteredData = (response.data?.arriveZoneList ?? []).filter(
        (zone) => zone.arriveZoneId !== 0
      );

      return {
        ...response.data,
        arriveZoneList: filteredData,
      };
    } catch (error) {
      console.error("회수 구역 정보 조회 실패:", error);
      return null;
    }
  };

/** 회수 구역 리셋 */
export const resetArriveZoneService = async (
  data: ArriveZoneResetRequestDto
): Promise<ArriveZoneResetResponseDto | null> => {
  try {
    const response = await api.resetArriveZone(data);
    return response.data;
  } catch (error) {
    console.error("회수 구역 리셋 실패:", error);
    return null;
  }
};
