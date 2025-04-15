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

export interface RobotUpdateRequestDto {
  /** @format int32 */
  robotId?: number;
  robotName?: string;
}

export interface RobotUpdateResponseDto {
  message?: string;
  isDone?: boolean;
}

export interface UserSignUpRequestDto {
  userLoginId?: string;
  userPassword?: string;
  userName?: string;
  userEmail?: string;
  /** @format date */
  userBirth?: string;
}

export interface UserSignUpResponseDto {
  message?: string;
  isDone?: boolean;
}

export interface UserRecordDto {
  bookIsbn?: string;
  /** @format date-time */
  borrowAt?: string;
  /** @format date-time */
  returnAt?: string;
  /**
   * 반납 완료, 대출 중, 연체 중...
   * @example "반납 완료"
   */
  status?: string;
}

export interface UserRecordResponseDto {
  userRecordList?: UserRecordDto[];
}

export interface UserRecordRequestDto {
  /** @format int32 */
  userId?: number;
}

export interface UserRobotRequestDto {
  /** @format int32 */
  robotId?: number;
  userCode?: string;
}

export interface UserRobotResponseDto {
  message?: string;
  isDone?: boolean;
}

export interface UserLeaveResponseDto {
  message?: string;
  isDone?: boolean;
}

export interface UserLeaveRequestDto {
  /** @format int32 */
  userId?: number;
}

export interface UserFrontRequestDto {
  /** @format int32 */
  robotId?: number;
}

export interface UserFrontResponseDto {
  /** @format int32 */
  userId?: number;
  userName?: string;
  userStatus?: string;
}

export interface UserDupCheckRequestDto {
  targetString?: string;
  /**
   * 중복 확인하려는 게 아이디면 0, 이메일이면 1
   * @format int32
   * @example 0
   */
  action?: number;
}

export interface UserDupCheckResponseDto {
  message?: string;
  isDone?: boolean;
}

export interface UserSearchPwRequestDto {
  userLoginId?: string;
  /** @format date */
  userBirth?: string;
}

export interface UserSearchPwResponseDto {
  message?: string;
  isDone?: boolean;
}

export interface UserSearchIdRequestDto {
  userEmail?: string;
}

export interface UserSearchIdResponseDto {
  message?: string;
  isDone?: boolean;
}

export interface UserLogoutResponseDto {
  message?: string;
  isDone?: boolean;
}

export interface UserLoginRequestDto {
  userLoginId?: string;
  userPassword?: string;
}

export interface UserLoginResponseDto {
  /** @format int32 */
  userId?: number;
  userName?: string;
}

export interface UserChangeRequestDto {
  /** @format int32 */
  userId?: number;
  userPassword?: string;
  /**
   * 비밀번호 재입력인지, 수정인지 재입력이면 0, 수정이면 1
   * @format int32
   * @example 0
   */
  action?: number;
}

export interface UserChangeResponseDto {
  message?: string;
  isDone?: boolean;
}

export interface BaseResponseDto {
  message?: string;
  isDone?: boolean;
}

export interface RobotInsertRequestDto {
  robotName?: string;
}

export interface RobotInsertResponseDto {
  message?: string;
  isDone?: boolean;
}

export interface VerifyOtpRequestDto {
  userEmail?: string;
  certNumber?: string;
}

export interface VerifyOtpResponseDto {
  message?: string;
  isDone?: boolean;
}

export interface SendOtpRequestDto {
  userEmail?: string;
}

export interface SendOtpResponseDto {
  message?: string;
  isDone?: boolean;
}

export interface NoticeDeleteRequestDto {
  /** @format int32 */
  noticeId?: number;
}

export interface NoticeDeleteResponseDto {
  message?: string;
  isDone?: boolean;
}

export interface CodeRequestDto {
  /** @format int32 */
  userId?: number;
}

export interface BookUpdateRequestDto {
  bookId?: string;
  bookIsbn?: string;
  bookTitle?: string;
  bookWriter?: string;
  bookPublisher?: string;
  /** @format int32 */
  bookStatus?: number;
  bookSign?: string;
  arriveZoneName?: string;
  /**
   * 0이면 등록, 1이면 수정
   * @format int32
   * @example 0
   */
  action?: number;
}

export interface BookUpdateResponseDto {
  message?: string;
  isDone?: boolean;
}

export interface BookFrontRequestDto {
  /** @format int32 */
  robotId?: number;
}

export interface BookFrontResponseDto {
  bookId?: string;
  bookIsbn?: string;
  bookStatus?: string;
}

export interface BookReturnStartRequestDto {
  bookId?: string;
  /** @format int32 */
  robotId?: number;
}

export interface BookReturnStartResponseDto {
  /** @format int32 */
  arriveZoneId?: number;
}

export interface BookRobotRequestDto {
  /** @format int32 */
  robotId?: number;
  bookId?: string;
}

export interface BookRobotResponseDto {
  message?: string;
  isDone?: boolean;
}

export interface BookReturnEndRequestDto {
  bookId?: string;
  /** @format int32 */
  robotId?: number;
}

export interface BookReturnEndResponseDto {
  message?: string;
  isDone?: boolean;
}

export interface BookBorrowRequestDto {
  bookId?: string;
  /** @format int32 */
  robotId?: number;
  /** @format int32 */
  userId?: number;
}

export interface BookBorrowResponseDto {
  message?: string;
  isDone?: boolean;
}

export interface ArriveZoneResetRequestDto {
  /** @format int32 */
  arriveZoneId?: number;
}

export interface ArriveZoneResetResponseDto {
  message?: string;
  isDone?: boolean;
}

export interface RobotDto {
  /** @format int32 */
  robotId?: number;
  robotName?: string;
  robotImageUrl?: string;
  robotStatus?: string;
}

export interface RobotResponseDto {
  robotList?: RobotDto[];
}

export interface RobotLogDto {
  robotLogType?: string;
  robotLogContent?: string;
  /** @format date-time */
  robotLogCreatedAt?: string;
  /** @format date-time */
  robotLogCompletedAt?: string;
}

export interface RobotLogResponseDto {
  robotLogList?: RobotLogDto[];
}

export interface NoticeDto {
  /** @format int32 */
  noticeId?: number;
  /** @format date-time */
  noticeCreatedAt?: string;
  noticeStatus?: boolean;
  noticeType?: string;
  noticeContent?: string;
  /** @format int32 */
  robotId?: number;
}

export interface NoticeResponseDto {
  noticeList?: NoticeDto[];
}

export interface NewNoticeResponseDto {
  /** @format int32 */
  newNoticeNumber?: number;
}

export interface BookDto {
  bookId?: string;
  bookIsbn?: string;
  bookStatus?: string;
  bookSign?: string;
  /** @format date */
  bookReturn?: string;
  arriveZoneName?: string;
}

export interface BookSearchResponseDto {
  bookList?: BookDto[];
}

export interface BookMostListResponseDto {
  bookRankList?: BookRankDto[];
}

export interface BookRankDto {
  bookId?: string;
  bookIsbn?: string;
  bookStatus?: string;
  bookSign?: string;
  /** @format date */
  bookReturn?: string;
  /** @format int32 */
  borrowCount?: number;
}

export interface BookDetailResponseDto {
  bookId?: string;
  bookIsbn?: string;
  bookStatus?: string;
  bookSign?: string;
  /** @format date */
  bookReturn?: string;
}

export interface ArriveZoneDto {
  /** @format int32 */
  arriveZoneId?: number;
  arriveZoneName?: string;
  /** @format int32 */
  arriveZoneBook?: number;
  /** @format date-time */
  arriveZoneTime?: string;
}

export interface ArriveZoneResponseDto {
  arriveZoneList?: ArriveZoneDto[];
}

export interface RobotDeleteRequestDto {
  /** @format int32 */
  robotId?: number;
}

export interface RobotDeleteResponseDto {
  message?: string;
  isDone?: boolean;
}

export interface BookDeleteRequestDto {
  bookId?: string;
}

export interface BookDeleteResponseDto {
  message?: string;
  isDone?: boolean;
}

export type ShowRobotListData = RobotResponseDto;

export interface UpdateRobotPayload {
  robotUpdateRequestDto: RobotUpdateRequestDto;
  /** @format binary */
  robotImage: File;
}

export type UpdateRobotData = RobotUpdateResponseDto;

export interface InsertRobotPayload {
  robotInsertRequestDto: RobotInsertRequestDto;
  /** @format binary */
  robotImage: File;
}

export type InsertRobotData = RobotInsertResponseDto;

export type DeleteRobotData = RobotDeleteResponseDto;

export type UserSignUpData = UserSignUpResponseDto;

export type SearchBookData = UserRecordResponseDto;

export type SearchBook2Data = UserRecordResponseDto;

export type UserInfoRobotData = UserRobotResponseDto;

export type LeaveUserData = UserLeaveResponseDto;

export type LeaveUser2Data = UserLeaveResponseDto;

export type UserInfoFrontData = UserFrontResponseDto;

export type UserDupCheckData = UserDupCheckResponseDto;

export type UserSearchPwData = UserSearchPwResponseDto;

export type UserSearchIdData = UserSearchIdResponseDto;

export type UserLogoutData = UserLogoutResponseDto;

export type UserLoginData = UserLoginResponseDto;

export type UserChangePwData = UserChangeResponseDto;

export type ValidateRefreshTokenData = BaseResponseDto;

export type VerifyOtpData = VerifyOtpResponseDto;

export type SendOtpData = SendOtpResponseDto;

export type ShowNoticeListData = NoticeResponseDto;

export type DeleteNoticeData = NoticeDeleteResponseDto;

/** @format byte */
export type GetCodeData = string;

/** @format byte */
export type GetCode2Data = string;

export type UpdateBookData = BookUpdateResponseDto;

export type DeleteBookData = BookDeleteResponseDto;

export type BookInfoFrontData = BookFrontResponseDto;

export type ReturnBookStartData = BookReturnStartResponseDto;

export type BookInfoRobotData = BookRobotResponseDto;

export type ReturnBookEndData = BookReturnEndResponseDto;

export type BorrowBookData = BookBorrowResponseDto;

export type ArriveZoneInfoData = ArriveZoneResponseDto;

export type ResetArriveZoneData = ArriveZoneResetResponseDto;

export type ShowRobotLogData = RobotLogResponseDto;

export type CheckUnreadNoticeData = NewNoticeResponseDto;

export type SearchBook1Data = BookSearchResponseDto;

export type BookMostData = BookMostListResponseDto;

export type GetBookDetailData = BookDetailResponseDto;
