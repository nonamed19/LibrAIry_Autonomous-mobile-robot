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
  <div className="p-4 mt-6 bg-peach rounded-lg shadow-md">
    <div className="p-6 space-y-6">
      <h3 className="text-white mb-2 text-xl font-semibold">
        {userName}님, 환영합니다!
      </h3>
      <div className="mt-2 space-y-1">
        <p className="text-white">
          대출중:{" "}
          <span className="font-bold text-blue">{borrowingCount}권</span>
        </p>
        <p className="text-white">
          연체중:{" "}
          <span className="font-bold text-primary">{overdueCount}권</span>
        </p>
      </div>
    </div>
  </div>
);

export default ProfileCard;
