import { Api } from "../backapi/Api";
import {
  UserLoginRequestDto,
  UserLoginData,
  UserLogoutData,
  UserSignUpRequestDto,
  UserSignUpResponseDto,
  UserDupCheckRequestDto,
  UserDupCheckData,
  VerifyOtpRequestDto,
  VerifyOtpData,
  SendOtpRequestDto,
  SendOtpData,
  UserSearchPwRequestDto,
  UserSearchPwData,
  UserSearchIdRequestDto,
  UserSearchIdData,
  UserChangeRequestDto,
  UserChangePwData,
  UserRecordDto,
  UserRecordResponseDto,
  UserInfoFrontData,
  UserFrontRequestDto,
  LeaveUserData,
} from "../backapi/data-contracts";

const api = new Api();

/** 사용자 로그인 */
export const userLoginService = async (
  payload: UserLoginRequestDto
): Promise<UserLoginData | null> => {
  try {
    const response = await api.userLogin(payload);

    const authHeader =
      response.headers["authorization"] || response.headers["Authorization"];
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split("Bearer ")[1]
      : null;

    if (
      response.data &&
      typeof response.data.userId === "number" &&
      typeof response.data.userName === "string" &&
      token
    ) {
      const { userId, userName } = response.data;
      const isAdmin = userId >= 1 && userId <= 5;

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({ userId, userName, isAdmin })
      );

      return response.data;
    } else {
      console.error("로그인 실패: 응답 데이터 없음");
      return null;
    }
  } catch (error) {
    console.error("로그인 실패:", error);
    return null;
  }
};

/** 사용자 로그아웃 */
export const userLogoutService = async (): Promise<UserLogoutData | null> => {
  try {
    const response = await api.userLogout();

    if (response.data) {
      localStorage.clear();
      return response.data;
    } else {
      console.error("로그아웃 실패: 응답 데이터 없음");
      return null;
    }
  } catch (error) {
    console.error("로그아웃 실패:", error);
    return null;
  }
};

/** 사용자 회원가입 */
export const userSignUpService = async (
  payload: UserSignUpRequestDto
): Promise<UserSignUpResponseDto | null> => {
  try {
    const response = await api.userSignUp(payload);
    return response.data;
  } catch (error) {
    console.error("회원가입 실패:", error);
    return null;
  }
};

/** 아이디/이메일 중복 확인 */
export const userDupCheckService = async (
  payload: UserDupCheckRequestDto
): Promise<UserDupCheckData | null> => {
  try {
    const response = await api.userDupCheck(payload);
    return response.data;
  } catch (error) {
    console.error("중복 확인 실패:", error);
    return null;
  }
};

/** OTP 발송 */
export const sendOtpService = async (
  payload: SendOtpRequestDto
): Promise<SendOtpData | null> => {
  try {
    const response = await api.sendOtp(payload);
    return response.data;
  } catch (error) {
    console.error("OTP 발송 실패:", error);
    return null;
  }
};

/** OTP 확인 */
export const verifyOtpService = async (
  payload: VerifyOtpRequestDto
): Promise<VerifyOtpData | null> => {
  try {
    const response = await api.verifyOtp(payload);
    return response.data;
  } catch (error) {
    console.error("OTP 확인 실패:", error);
    return null;
  }
};

/** 비밀번호 찾기 */
export const searchPasswordService = async (
  payload: UserSearchPwRequestDto
): Promise<UserSearchPwData | null> => {
  try {
    const response = await api.userSearchPw(payload);
    return response.data;
  } catch (error) {
    console.error("비밀번호 찾기 실패:", error);
    return null;
  }
};

/** 아이디 찾기 */
export const searchIdService = async (
  payload: UserSearchIdRequestDto
): Promise<UserSearchIdData | null> => {
  try {
    const response = await api.userSearchId(payload);
    return response.data;
  } catch (error) {
    console.error("아이디 찾기 실패:", error);
    return null;
  }
};

/** 비밀번호 변경 */
export const changePasswordService = async (
  payload: UserChangeRequestDto
): Promise<UserChangePwData | null> => {
  try {
    const response = await api.userChangePw(payload);
    return response.data;
  } catch (error) {
    console.error("비밀번호 변경 실패:", error);
    return null;
  }
};

/** 대출 기록 조회 */
export const fetchUserRecords = async () //userId: number
: Promise<UserRecordDto[]> => {
  try {
    const response = await api.searchBook({});
    const data: UserRecordResponseDto = response.data;

    // userRecordList가 존재하면 반환하고, 없으면 빈 배열 반환
    return data.userRecordList ? data.userRecordList : [];
  } catch (error) {
    console.error("대출 기록 조회 오류:", error);
    return [];
  }
};

/** QR 코드 조회 */
export const fetchUserQrCode = async () //userId: number
: Promise<string | null> => {
  try {
    const response = await api.instance.post(
      `/api/code`,
      {},
      { responseType: "blob" }
    );
    const blob = response.data;

    // Blob 데이터를 Object URL로 변환
    const objectURL = URL.createObjectURL(blob);
    return objectURL;
  } catch (error) {
    console.error("QR 코드 조회 오류:", error);
    return null;
  }
};
/**
 * 사용자 정보 조회 서비스 (회원 정보)
 */
export const fetchUserInfoService = async (
  payload: UserFrontRequestDto
): Promise<UserInfoFrontData | null> => {
  try {
    const response = await api.userInfoFront(payload);
    return response.data;
  } catch (error) {
    console.error("사용자 정보 조회 실패:", error);
    return null;
  }
};

// 회원 탈퇴
export const userWithdrawalService =
  async (): Promise<LeaveUserData | null> => {
    try {
      const response = await api.leaveUser();
      if (response.data) {
        console.log("회원 탈퇴 성공:", response.data);
        localStorage.clear();
        return response.data;
      } else {
        console.error("회원 탈퇴 실패: 응답 데이터 없음");
        return null;
      }
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      return null;
    }
  };
