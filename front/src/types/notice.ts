export interface Notice {
  /**
   * 알림 고유 식별자 (API: noticeId)
   */
  id: number;
  /**
   * 알림 생성 일시 (ISO 문자열)
   */
  createdAt: string;
  /**
   * 알림 읽음 여부 (true: 읽음, false: 미읽음)
   */
  status: boolean;
  /**
   * 알림 유형 (예: "시스템", "사용자", "긴급" 등)
   */
  type: string;
  /**
   * 알림 상세 내용
   */
  content: string;
  /**
   * 해당 알림과 연관된 로봇 식별자 (옵션)
   */
  robotId?: number;
}
