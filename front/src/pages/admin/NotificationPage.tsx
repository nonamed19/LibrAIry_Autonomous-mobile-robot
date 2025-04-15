import { FC, useState, useEffect } from "react";
import NotificationPanel from "../../components/admin/NotificationPanel";
import type { Notice } from "../../types/notice";
import {
  fetchNoticeList,
  deleteNoticeService,
} from "../../services/noticeService";
import { formatTDate } from "../../utils/formatters";
import dayjs from "dayjs";

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
    <div className="min-h-screen py-8 bg-snow">
      <div className="container px-4 mx-auto">
        <h2 className="mt-6 mb-2 text-2xl font-bold">
          <span className="text-primary">알림 내역</span>
        </h2>

        {error && <p className="text-orange">{error}</p>}

        {loading ? (
          <p>로딩 중...</p>
        ) : notices.length === 0 ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <p className="text-gray-600 text-lg font-semibold">
              현재 알림이 없습니다.
            </p>
          </div>
        ) : (
          <NotificationPanel notices={notices} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
