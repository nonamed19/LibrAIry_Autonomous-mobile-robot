import { Api } from "../backapi/Api";
import type {
  RobotResponseDto,
  UpdateRobotPayload,
  UpdateRobotData,
  InsertRobotData,
  RobotDeleteRequestDto,
  DeleteRobotData,
  ShowRobotLogData,
} from "../backapi/data-contracts";

const api = new Api();

/** 로봇 리스트 조회 */
export const fetchRobotList = async (): Promise<RobotResponseDto | null> => {
  try {
    const response = await api.showRobotList();
    if (response.data && Array.isArray(response.data.robotList)) {
      return response.data;
    }
    throw new Error("로봇 리스트 데이터가 유효하지 않습니다.");
  } catch (error) {
    console.error("로봇 리스트 불러오기 실패:", error);
    throw error;
  }
};

/** 로봇 정보 수정 */
export const updateRobotService = async (
  data: UpdateRobotPayload | FormData
): Promise<UpdateRobotData | null> => {
  try {
    const response = await api.updateRobot(data);
    return response.data;
  } catch (error) {
    console.error("로봇 정보 수정 실패:", error);
    return null;
  }
};

/** 로봇 정보 추가 */
export const insertRobotService = async (
  formData: FormData
): Promise<InsertRobotData | null> => {
  try {
    const response = await api.insertRobot(formData);
    return response.data;
  } catch (error) {
    console.error("로봇 추가 실패:", error);
    return null;
  }
};

/** 로봇 정보 삭제 */
export const deleteRobotService = async (
  data: RobotDeleteRequestDto
): Promise<DeleteRobotData | null> => {
  try {
    const response = await api.deleteRobot(data);
    return response.data;
  } catch (error) {
    console.error("로봇 삭제 실패:", error);
    return null;
  }
};

/** 로봇 활동 로그 조회 */
export const fetchRobotLog = async (
  robotId: number
): Promise<ShowRobotLogData | null> => {
  try {
    const response = await api.showRobotLog({ robotId });
    return response.data;
  } catch (error) {
    console.error("로봇 활동 로그 조회 실패:", error);
    return null;
  }
};
