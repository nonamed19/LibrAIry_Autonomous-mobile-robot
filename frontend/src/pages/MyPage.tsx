import { FC, useEffect, useState } from "react";
import ProfileCard from "../components/user/ProfileCard";
import { useAuth } from "../hooks/useAuth";
import { fetchUserRecords } from "../services/userService";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { BookMarked, ChevronRight, LogOut, Settings } from "lucide-react";
import PageHeader from "../components/common/PageHeader";

interface BorrowStats {
  borrowingCount: number;
  overdueCount: number;
}

const MyPage: FC = () => {
  const { user, logout } = useAuth();
  const [borrowStats, setBorrowStats] = useState<BorrowStats>({
    borrowingCount: 0,
    overdueCount: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBorrowingStats = async () => {
      if (!user) return;

      try {
        const records = await fetchUserRecords();
        const now = dayjs();
        let borrowingCount = 0;
        let overdueCount = 0;

        records.forEach((record) => {
          if (!record.returnAt) {
            const borrowDate = dayjs(record.borrowAt);
            const dueDate = borrowDate.add(2, "week");

            if (now.isBefore(dueDate)) {
              borrowingCount += 1; // 2주 이내면 대출중
            } else {
              overdueCount += 1; // 2주 초과면 연체중
            }
          }
        });

        setBorrowStats({ borrowingCount, overdueCount });
      } catch (error) {
        console.error("대출 현황을 가져오는 중 오류 발생:", error);
      }
    };

    fetchBorrowingStats();
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold text-gray-600">
          로그인이 필요합니다.
        </p>
      </div>
    );
  }

  return (
    <div className="page-layout narrow">
      <PageHeader eyebrow="MY ACCOUNT" title="마이 페이지" description="이용 현황과 계정 설정을 관리하세요." />
        <ProfileCard
          userName={user.userName}
          borrowingCount={borrowStats.borrowingCount}
          overdueCount={borrowStats.overdueCount}
        />

        <div className="page-card mt-4 p-2">
          <ul>
            <li>
              <button
                className="account-menu-item"
                onClick={() => navigate("/my-info")}
              >
                <span><Settings size={19} /> 내 정보 관리</span><ChevronRight size={19} />
              </button>
            </li>
            <li>
              <button className="account-menu-item" onClick={() => navigate("/bookshelf")}>
                <span><BookMarked size={19} /> 대출·반납 기록</span><ChevronRight size={19} />
              </button>
            </li>
            <li>
              <button
                className="account-menu-item danger"
                onClick={() => void logout()}
              >
                <span><LogOut size={19} /> 로그아웃</span><ChevronRight size={19} />
              </button>
            </li>
          </ul>
        </div>
    </div>
  );
};

export default MyPage;
