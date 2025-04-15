import { FC } from "react";
import type { Notice } from "../../types/notice";

export interface NotificationPanelProps {
  notices: Notice[];
  onDelete: (noticeId: number) => void;
}

const NotificationPanel: FC<NotificationPanelProps> = ({
  notices,
  onDelete,
}) => {
  return (
    <div className="space-y-3">
      {notices.map((notice) => (
        <div
          key={notice.id}
          className="p-4 rounded-lg bg-white shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md"
        >
          <div className="flex justify-between items-start mb-2">
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                notice.type === "대출"
                  ? "bg-blue text-white"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {notice.type}
            </span>

            <button
              className="text-xs text-gray-400 hover:text-red-500 transition-colors duration-200"
              onClick={() => onDelete(notice.id)}
            >
              삭제
            </button>
          </div>

          <p className="text-gray-700 text-sm mb-2">{notice.content}</p>

          <p className="text-xs text-gray-400">{notice.createdAt}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationPanel;
