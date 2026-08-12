/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  ArriveZoneInfoData,
  ArriveZoneResetRequestDto,
  BookBorrowRequestDto,
  BookDeleteRequestDto,
  BookFrontRequestDto,
  BookInfoFrontData,
  BookInfoRobotData,
  BookMostData,
  BookReturnEndRequestDto,
  BookReturnStartRequestDto,
  BookRobotRequestDto,
  BookUpdateRequestDto,
  BorrowBookData,
  CheckUnreadNoticeData,
  CodeRequestDto,
  DeleteBookData,
  DeleteNoticeData,
  DeleteRobotData,
  GetBookDetailData,
  GetCode2Data,
  GetCodeData,
  InsertRobotData,
  InsertRobotPayload,
  LeaveUser2Data,
  LeaveUserData,
  NoticeDeleteRequestDto,
  ResetArriveZoneData,
  ReturnBookEndData,
  ReturnBookStartData,
  RobotDeleteRequestDto,
  SearchBook1Data,
  SearchBook2Data,
  SearchBookData,
  SendOtpData,
  SendOtpRequestDto,
  ShowNoticeListData,
  ShowRobotListData,
  ShowRobotLogData,
  UpdateBookData,
  UpdateRobotData,
  UpdateRobotPayload,
  UserChangePwData,
  UserChangeRequestDto,
  UserDupCheckData,
  UserDupCheckRequestDto,
  UserFrontRequestDto,
  UserInfoFrontData,
  UserInfoRobotData,
  UserLeaveRequestDto,
  UserLoginData,
  UserLoginRequestDto,
  UserLogoutData,
  UserRecordRequestDto,
  UserRobotRequestDto,
  UserSearchIdData,
  UserSearchIdRequestDto,
  UserSearchPwData,
  UserSearchPwRequestDto,
  UserSignUpData,
  UserSignUpRequestDto,
  ValidateRefreshTokenData,
  VerifyOtpData,
  VerifyOtpRequestDto,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Api<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description 관리자가 로봇 현황 배너를 클릭하면 요청되는 API 입니다.
   *
   * @tags robot 도메인
   * @name ShowRobotList
   * @summary 로봇 리스트 조회
   * @request GET:/api/robot
   * @response `200` `ShowRobotListData` OK
   */
  showRobotList = (params: RequestParams = {}) =>
    this.request<ShowRobotListData, any>({
      path: `/api/robot`,
      method: "GET",
      ...params,
    });
  /**
   * @description 관리자가 로봇 정보를 수정할 때의 API 입니다.
   *
   * @tags robot 도메인
   * @name UpdateRobot
   * @summary 로봇 정보 수정
   * @request PUT:/api/robot
   * @response `200` `UpdateRobotData` OK
   */
  updateRobot = (
    data: UpdateRobotPayload | FormData,
    params: RequestParams = {}
  ) =>
    this.request<UpdateRobotData, any>({
      path: `/api/robot`,
      method: "PUT",
      body: data,
      type: ContentType.FormData,
      ...params,
    });
  /**
   * @description 관리자가 로봇을 추가할 때의 API 입니다.
   *
   * @tags robot 도메인
   * @name InsertRobot
   * @summary 로봇 정보 추가
   * @request POST:/api/robot
   * @response `200` `InsertRobotData` OK
   */
  insertRobot = (
    data: InsertRobotPayload | FormData,
    params: RequestParams = {}
  ) =>
    this.request<InsertRobotData, any>({
      path: `/api/robot`,
      method: "POST",
      body: data,
      type: ContentType.FormData,
      ...params,
    });
  /**
   * @description 관리자가 로봇 정보를 삭제할 때의 API 입니다.
   *
   * @tags robot 도메인
   * @name DeleteRobot
   * @summary 로봇 정보 삭제
   * @request DELETE:/api/robot
   * @response `200` `DeleteRobotData` OK
   */
  deleteRobot = (data: RobotDeleteRequestDto, params: RequestParams = {}) =>
    this.request<DeleteRobotData, any>({
      path: `/api/robot`,
      method: "DELETE",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 회원 가입 시에 요청되는 API 입니다.
   *
   * @tags user 도메인
   * @name UserSignUp
   * @summary 사용자 회원 가입
   * @request POST:/api/user/signup
   * @response `200` `UserSignUpData` OK
   */
  userSignUp = (data: UserSignUpRequestDto, params: RequestParams = {}) =>
    this.request<UserSignUpData, any>({
      path: `/api/user/signup`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 사용자의 마이 페이지에서 대출 현황을 클릭했을 때 요청되는 API 입니다.
   *
   * @tags user 도메인
   * @name SearchBook
   * @summary 사용자 대출 기록 조회
   * @request POST:/api/user/search
   * @response `200` `SearchBookData` OK
   */
  searchBook = (params: RequestParams = {}) =>
    this.request<SearchBookData, any>({
      path: `/api/user/search`,
      method: "POST",
      ...params,
    });
  /**
   * @description 사용자의 마이 페이지에서 대출 현황을 클릭했을 때 요청되는 API 입니다.
   *
   * @tags user 도메인
   * @name SearchBook2
   * @summary 사용자 대출 기록 조회 - JWT 사용 x
   * @request POST:/api/user/search2
   * @response `200` `SearchBook2Data` OK
   */
  searchBook2 = (data: UserRecordRequestDto, params: RequestParams = {}) =>
    this.request<SearchBook2Data, any>({
      path: `/api/user/search2`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 로봇에서 사용자 바코드를 찍고 사용자 정보를 백엔드에 저장할 때 사용되는 API 입니다.
   *
   * @tags user 도메인
   * @name UserInfoRobot
   * @summary 대출 사용자 정보 저장
   * @request POST:/api/user/save
   * @response `200` `UserInfoRobotData` OK
   */
  userInfoRobot = (data: UserRobotRequestDto, params: RequestParams = {}) =>
    this.request<UserInfoRobotData, any>({
      path: `/api/user/save`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 사용자가 회원 탈퇴 시에 요청하는 API 입니다.
   *
   * @tags user 도메인
   * @name LeaveUser
   * @summary 사용자 회원 탈퇴
   * @request POST:/api/user/leave
   * @response `200` `LeaveUserData` OK
   */
  leaveUser = (params: RequestParams = {}) =>
    this.request<LeaveUserData, any>({
      path: `/api/user/leave`,
      method: "POST",
      ...params,
    });
  /**
   * @description 사용자가 회원 탈퇴 시에 요청하는 API 입니다.
   *
   * @tags user 도메인
   * @name LeaveUser2
   * @summary 사용자 회원 탈퇴 - JWT 사용 x
   * @request POST:/api/user/leave2
   * @response `200` `LeaveUser2Data` OK
   */
  leaveUser2 = (data: UserLeaveRequestDto, params: RequestParams = {}) =>
    this.request<LeaveUser2Data, any>({
      path: `/api/user/leave2`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 프론트에서 저장된 사용자 코드를 이용해 사용자 정보를 조회할 때 사용되는 API 입니다.
   *
   * @tags user 도메인
   * @name UserInfoFront
   * @summary 대출 사용자 정보 조회
   * @request POST:/api/user/front
   * @response `200` `UserInfoFrontData` OK
   */
  userInfoFront = (data: UserFrontRequestDto, params: RequestParams = {}) =>
    this.request<UserInfoFrontData, any>({
      path: `/api/user/front`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 사용자가 회원가입 시에 아이디 또는 이메일의 중복 확인을 할 때 사용되는 API 입니다. action: 0이면 아이디, 1이면 이메일
   *
   * @tags user 도메인
   * @name UserDupCheck
   * @summary 사용자 아이디/이메일 중복 확인
   * @request POST:/api/user/dupcheck
   * @response `200` `UserDupCheckData` OK
   */
  userDupCheck = (data: UserDupCheckRequestDto, params: RequestParams = {}) =>
    this.request<UserDupCheckData, any>({
      path: `/api/user/dupcheck`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 사용자가 비밀번호를 찾을 때 사용되는 API 입니다.
   *
   * @tags user/auth 도메인
   * @name UserSearchPw
   * @summary 사용자 비밀번호 찾기 - 아이디, 생년월일과 연결된 이메일로 임시 비밀번호 발송
   * @request POST:/api/user/auth/searchpw
   * @response `200` `UserSearchPwData` OK
   */
  userSearchPw = (data: UserSearchPwRequestDto, params: RequestParams = {}) =>
    this.request<UserSearchPwData, any>({
      path: `/api/user/auth/searchpw`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 사용자가 아이디를 찾을 때 사용되는 API 입니다.
   *
   * @tags user/auth 도메인
   * @name UserSearchId
   * @summary 사용자 아이디 찾기 - 이메일로 아이디 발송
   * @request POST:/api/user/auth/searchid
   * @response `200` `UserSearchIdData` OK
   */
  userSearchId = (data: UserSearchIdRequestDto, params: RequestParams = {}) =>
    this.request<UserSearchIdData, any>({
      path: `/api/user/auth/searchid`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 사용자가 로그아웃 할 때 사용되는 API 입니다.
   *
   * @tags user/auth 도메인
   * @name UserLogout
   * @summary 사용자 로그아웃
   * @request POST:/api/user/auth/logout
   * @response `200` `UserLogoutData` OK
   */
  userLogout = (params: RequestParams = {}) =>
    this.request<UserLogoutData, any>({
      path: `/api/user/auth/logout`,
      method: "POST",
      ...params,
    });
  /**
   * @description 사용자가 로그인 할 때 사용되는 API 입니다.
   *
   * @tags user/auth 도메인
   * @name UserLogin
   * @summary 사용자 로그인
   * @request POST:/api/user/auth/login
   * @response `200` `UserLoginData` OK
   */
  userLogin = (data: UserLoginRequestDto, params: RequestParams = {}) =>
    this.request<UserLoginData, any>({
      path: `/api/user/auth/login`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 사용자가 비밀번호를 변경할 때 사용되는 API 입니다. action: 0이면 재입력, 1이면 수정
   *
   * @tags user/auth 도메인
   * @name UserChangePw
   * @summary 사용자 비밀번호 변경 과정에서 비밀번호 재입력/수정
   * @request POST:/api/user/auth/change
   * @response `200` `UserChangePwData` OK
   */
  userChangePw = (data: UserChangeRequestDto, params: RequestParams = {}) =>
    this.request<UserChangePwData, any>({
      path: `/api/user/auth/change`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Access Token이 만료되었을 때, 클라이언트가 Refresh Token과 함께 요청을 보내서, 새로운 Access Token을 발급받는 데에 이용되는 API 입니다.
   *
   * @tags token 도메인
   * @name ValidateRefreshToken
   * @summary Access Token 다시 받기
   * @request POST:/api/token
   * @response `200` `ValidateRefreshTokenData` OK
   */
  validateRefreshToken = (params: RequestParams = {}) =>
    this.request<ValidateRefreshTokenData, any>({
      path: `/api/token`,
      method: "POST",
      ...params,
    });
  /**
   * @description 사용자가 회원 가입할 때, 이메일 인증 시 사용되는 API 입니다.
   *
   * @tags otp 도메인 (인증 번호 관련)
   * @name VerifyOtp
   * @summary 사용자 회원가입 시 이메일로 보낸 인증 번호 확인
   * @request POST:/api/otp/verify
   * @response `200` `VerifyOtpData` OK
   */
  verifyOtp = (data: VerifyOtpRequestDto, params: RequestParams = {}) =>
    this.request<VerifyOtpData, any>({
      path: `/api/otp/verify`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 사용자가 회원 가입할 때, 이메일 인증 시 사용되는 API 입니다.
   *
   * @tags otp 도메인 (인증 번호 관련)
   * @name SendOtp
   * @summary 사용자 회원가입 시 이메일로 인증 번호 발송
   * @request POST:/api/otp/send
   * @response `200` `SendOtpData` OK
   */
  sendOtp = (data: SendOtpRequestDto, params: RequestParams = {}) =>
    this.request<SendOtpData, any>({
      path: `/api/otp/send`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 알림 버튼(종 모양 버튼??)을 눌렀을 때, 알림 목록을 불러오는 API 입니다.
   *
   * @tags notice 도메인
   * @name ShowNoticeList
   * @summary 알림 리스트 조회
   * @request GET:/api/notice
   * @response `200` `ShowNoticeListData` OK
   */
  showNoticeList = (params: RequestParams = {}) =>
    this.request<ShowNoticeListData, any>({
      path: `/api/notice`,
      method: "GET",
      ...params,
    });
  /**
   * @description 특정 알림의 삭제 버튼을 누르면 알림이 삭제되는 API 입니다.
   *
   * @tags notice 도메인
   * @name DeleteNotice
   * @summary 알림 삭제
   * @request POST:/api/notice
   * @response `200` `DeleteNoticeData` OK
   */
  deleteNotice = (data: NoticeDeleteRequestDto, params: RequestParams = {}) =>
    this.request<DeleteNoticeData, any>({
      path: `/api/notice`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 사용자가 대출을 하기 위해 QR 코드를 요청하는 API 입니다.
   *
   * @tags QR 코드 도메인
   * @name GetCode
   * @summary 사용자 QR 코드 조회
   * @request POST:/api/code
   * @response `200` `GetCodeData` OK
   */
  getCode = (params: RequestParams = {}) =>
    this.request<GetCodeData, any>({
      path: `/api/code`,
      method: "POST",
      ...params,
    });
  /**
   * @description 사용자가 대출을 하기 위해 QR 코드를 요청하는 API 입니다.
   *
   * @tags QR 코드 도메인
   * @name GetCode2
   * @summary 사용자 QR 코드 조회 - JWT 사용 x
   * @request POST:/api/code/2
   * @response `200` `GetCode2Data` OK
   */
  getCode2 = (data: CodeRequestDto, params: RequestParams = {}) =>
    this.request<GetCode2Data, any>({
      path: `/api/code/2`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 관리자가 도서관에 책 정보를 등록/수정할 때 사용되는 API 입니다 action: 0이면 등록, 1이면 수정
   *
   * @tags book/user 도메인
   * @name UpdateBook
   * @summary 도서 등록/도서 정보 수정
   * @request POST:/api/book/user
   * @response `200` `UpdateBookData` OK
   */
  updateBook = (data: BookUpdateRequestDto, params: RequestParams = {}) =>
    this.request<UpdateBookData, any>({
      path: `/api/book/user`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 관리자가 도서관의 책 정보를 삭제할 때 이용하는 API 입니다.
   *
   * @tags book/user 도메인
   * @name DeleteBook
   * @summary 도서 삭제
   * @request DELETE:/api/book/user
   * @response `200` `DeleteBookData` OK
   */
  deleteBook = (data: BookDeleteRequestDto, params: RequestParams = {}) =>
    this.request<DeleteBookData, any>({
      path: `/api/book/user`,
      method: "DELETE",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 프론트에서 저장된 책 정보를 요청하는 API 입니다.
   *
   * @tags book/user 도메인
   * @name BookInfoFront
   * @summary 대출하려는 도서 정보 요청
   * @request POST:/api/book/user/front
   * @response `200` `BookInfoFrontData` OK
   */
  bookInfoFront = (data: BookFrontRequestDto, params: RequestParams = {}) =>
    this.request<BookInfoFrontData, any>({
      path: `/api/book/user/front`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 로봇에서 책을 반납 또는 반환 시작시의 API 입니다
   *
   * @tags book/robot 도메인
   * @name ReturnBookStart
   * @summary 도서 반납/반환 시작
   * @request POST:/api/book/robot/start
   * @response `200` `ReturnBookStartData` OK
   */
  returnBookStart = (
    data: BookReturnStartRequestDto,
    params: RequestParams = {}
  ) =>
    this.request<ReturnBookStartData, any>({
      path: `/api/book/robot/start`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 로봇에서 책을 인식하고 정보를 백엔드에 보내는 API 입니다.
   *
   * @tags book/robot 도메인
   * @name BookInfoRobot
   * @summary 대출하려는 도서 정보 저장
   * @request POST:/api/book/robot/save
   * @response `200` `BookInfoRobotData` OK
   */
  bookInfoRobot = (data: BookRobotRequestDto, params: RequestParams = {}) =>
    this.request<BookInfoRobotData, any>({
      path: `/api/book/robot/save`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 로봇에서 책을 반납 또는 반환을 완료했을 때의 API 입니다
   *
   * @tags book/robot 도메인
   * @name ReturnBookEnd
   * @summary 도서 반납/반환 완료
   * @request POST:/api/book/robot/end
   * @response `200` `ReturnBookEndData` OK
   */
  returnBookEnd = (data: BookReturnEndRequestDto, params: RequestParams = {}) =>
    this.request<ReturnBookEndData, any>({
      path: `/api/book/robot/end`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 로봇에서 책을 대출할 때의 API 입니다.
   *
   * @tags book/robot 도메인
   * @name BorrowBook
   * @summary 도서 대출
   * @request POST:/api/book/robot/borrow
   * @response `200` `BorrowBookData` OK
   */
  borrowBook = (data: BookBorrowRequestDto, params: RequestParams = {}) =>
    this.request<BorrowBookData, any>({
      path: `/api/book/robot/borrow`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 관리자가 회수 현황 배너를 클릭하면 요청되는 API 입니다.
   *
   * @tags arrivezone 도메인
   * @name ArriveZoneInfo
   * @summary 회수 구역 상태 조회
   * @request GET:/api/arrivezone
   * @response `200` `ArriveZoneInfoData` OK
   */
  arriveZoneInfo = (params: RequestParams = {}) =>
    this.request<ArriveZoneInfoData, any>({
      path: `/api/arrivezone`,
      method: "GET",
      ...params,
    });
  /**
   * @description 관리자가 회수 구역에서 책을 정리한 이후에 누르는 버튼입니다.
   *
   * @tags arrivezone 도메인
   * @name ResetArriveZone
   * @summary 회수 구역 상태 리셋
   * @request POST:/api/arrivezone
   * @response `200` `ResetArriveZoneData` OK
   */
  resetArriveZone = (
    data: ArriveZoneResetRequestDto,
    params: RequestParams = {}
  ) =>
    this.request<ResetArriveZoneData, any>({
      path: `/api/arrivezone`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 로봇에서 책을 반납 또는 반환할 때의 API 입니다.
   *
   * @tags robot 도메인
   * @name ShowRobotLog
   * @summary 로봇 활동 로그 조회
   * @request GET:/api/robot/log
   * @response `200` `ShowRobotLogData` OK
   */
  showRobotLog = (
    query: {
      /** @format int32 */
      robotId: number;
    },
    params: RequestParams = {}
  ) =>
    this.request<ShowRobotLogData, any>({
      path: `/api/robot/log`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * @description 읽지 않은 알림이 있는지 관리자 쪽애서 주기적으로 요청하는 API 입니다.
   *
   * @tags notice 도메인
   * @name CheckUnreadNotice
   * @summary 읽지 않은 알림 개수 조회
   * @request GET:/api/notice/new
   * @response `200` `CheckUnreadNoticeData` OK
   */
  checkUnreadNotice = (params: RequestParams = {}) =>
    this.request<CheckUnreadNoticeData, any>({
      path: `/api/notice/new`,
      method: "GET",
      ...params,
    });
  /**
   * @description 사용자 또는 관리자가 도서 검색을 할 때의 API 입니다. action: 0: 제목, 1: 작가, 2: 출판사, 3:RFID
   *
   * @tags book/user 도메인
   * @name SearchBook1
   * @summary 도서 검색
   * @request GET:/api/book/user/search
   * @response `200` `SearchBook1Data` OK
   */
  searchBook1 = (
    query: {
      searchString: string;
      /** @format int32 */
      action: number;
    },
    params: RequestParams = {}
  ) =>
    this.request<SearchBook1Data, any>({
      path: `/api/book/user/search`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * @description 사용자 화면에서 주간/월간 대출 리스트를 띄워줄 때 사용되는 API 입니다. action: 0이면 주간, 1이면 월간
   *
   * @tags book/user 도메인
   * @name BookMost
   * @summary 주간/월간 대출 순위 리스트
   * @request GET:/api/book/user/most
   * @response `200` `BookMostData` OK
   */
  bookMost = (
    query: {
      /** @format int32 */
      action: number;
    },
    params: RequestParams = {}
  ) =>
    this.request<BookMostData, any>({
      path: `/api/book/user/most`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * @description 사용자가 도서를 클릭하면 상세 정보를 제공해주는 API 입니다.
   *
   * @tags book/user 도메인
   * @name GetBookDetail
   * @summary 도서 상세 정보
   * @request GET:/api/book/user/detail
   * @response `200` `GetBookDetailData` OK
   */
  getBookDetail = (
    query: {
      bookId: string;
    },
    params: RequestParams = {}
  ) =>
    this.request<GetBookDetailData, any>({
      path: `/api/book/user/detail`,
      method: "GET",
      query: query,
      ...params,
    });
}
