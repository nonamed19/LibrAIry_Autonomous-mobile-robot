import { FC, useEffect, useState } from "react";
import ProfileCard from "../components/user/ProfileCard";
import { useAuth } from "../hooks/useAuth";
import { fetchUserRecords } from "../services/userService";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

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
    <div>
      <div className="container max-w-4xl px-4 py-8 mx-auto">
        <ProfileCard
          userName={user.userName}
          borrowingCount={borrowStats.borrowingCount}
          overdueCount={borrowStats.overdueCount}
        />

        {/* 메뉴 섹션 */}
        <div className="p-4 mt-6 bg-white rounded-lg shadow-md">
          <ul className="space-y-4">
            <li>
              <button
                className="w-full text-left text-blue-hover hover:underline"
                onClick={() => navigate("/my-info")}
              >
                내 정보 관리
              </button>
            </li>
            <li>
              <button
                className="w-full text-left  text-blue-hover hover:underline"
                onClick={logout}
              >
                로그아웃
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
