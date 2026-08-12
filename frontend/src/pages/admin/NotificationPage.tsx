import { FC, useState, useEffect } from "react";
import NotificationPanel from "../../components/admin/NotificationPanel";
import type { Notice } from "../../types/notice";
import {
  fetchNoticeList,
  deleteNoticeService,
} from "../../services/noticeService";
import { formatTDate } from "../../utils/formatters";
import dayjs from "dayjs";
import PageHeader from "../../components/common/PageHeader";

const NotificationPage: FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 전체 알림 목록을 로드하는 함수
  const loadNotices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchNoticeList();
      if (res?.noticeList) {
        // NoticeDto를 types/notice.ts의 Notice 모델로 변환 및 날짜 포맷팅 적용
        const transformed: Notice[] = res.noticeList.map((n) => ({
          id: n.noticeId ?? 0,
          createdAt: formatTDate(n.noticeCreatedAt || ""),
          status: n.noticeStatus ?? false,
          type: n.noticeType || "",
          content: n.noticeContent || "",
          robotId: n.robotId,
        }));

        // 최신순 정렬
        const sortedNotices = transformed.sort((a, b) => {
          const dateA = dayjs(a.createdAt === "-" ? 0 : a.createdAt);
          const dateB = dayjs(b.createdAt === "-" ? 0 : b.createdAt);
          return dateB.diff(dateA);
        });

        setNotices(sortedNotices);
      } else {
        setError("알림 정보를 불러오지 못했습니다.");
      }
    } catch (e) {
      console.error("알림 조회 실패:", e);
      setError("알림 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  // 개별 알림 삭제 처리
  const handleDelete = async (noticeId: number) => {
    if (!window.confirm("해당 알림을 삭제하시겠습니까?")) return;
    try {
      const res = await deleteNoticeService({ noticeId });
      if (res && res.isDone) {
        alert("알림이 삭제되었습니다.");
        // 삭제된 알림은 상태에서 제거
        setNotices((prev) => prev.filter((notice) => notice.id !== noticeId));
      } else {
        alert("알림 삭제에 실패했습니다.");
      }
    } catch (e) {
      console.error("알림 삭제 실패:", e);
      alert("알림 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="page-layout narrow">
      <PageHeader eyebrow="OPERATION ALERTS" title="알림 내역" description="로봇과 회수 업무에서 발생한 최신 알림을 확인하세요." />

        {error && <p className="page-feedback">{error}</p>}

        {loading ? (
          <p>로딩 중...</p>
        ) : notices.length === 0 ? (
          <div className="page-empty">현재 확인할 알림이 없습니다.</div>
        ) : (
          <NotificationPanel notices={notices} onDelete={handleDelete} />
        )}
    </div>
  );
};

export default NotificationPage;
