import { FC } from "react";

interface ProfileCardProps {
  userName: string;
  borrowingCount: number;
  overdueCount: number;
}

const ProfileCard: FC<ProfileCardProps> = ({
  userName,
  borrowingCount,
  overdueCount,
}) => (
  <div className="profile-summary">
    <div>
      <p className="page-eyebrow">LIBRARY STATUS</p>
      <h3>
        {userName}님, 환영합니다!
      </h3>
      <p>현재 도서관 이용 현황입니다.</p>
    </div>
    <div className="profile-stats">
      <div><span>대출 중</span><b>{borrowingCount}<small>권</small></b></div>
      <div className={overdueCount > 0 ? "overdue" : ""}><span>연체 중</span><b>{overdueCount}<small>권</small></b></div>
    </div>
  </div>
);

export default ProfileCard;
