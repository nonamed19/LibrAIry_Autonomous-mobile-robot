import type { FC } from "react";
import { motion } from "framer-motion";
import { Book, Clock } from "lucide-react";

export interface CollectionAreaCardProps {
  areaName: string;
  bookCount: number;
  updateTime?: string;
}

const CollectionAreaCard: FC<CollectionAreaCardProps> = ({
  areaName,
  bookCount,
  updateTime,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="w-full p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
  >
    <h3 className="mb-4 text-2xl font-bold text-gray-800">{areaName}</h3>
    <div className="flex items-center mb-3">
      <Book className="w-5 h-5 mr-2 text-blue" />
      <p className="text-lg font-semibold text-gray-700">
        도서 수: <span className="text-blue">{bookCount}</span>
      </p>
    </div>
    <div className="flex items-center">
      <Clock className="w-5 h-5 mr-2 text-orange" />
      {updateTime ? (
        <p className="text-sm text-gray-600">
          최근 업데이트
          <br />
          {new Date(updateTime).toLocaleString()}
        </p>
      ) : (
        <p className="text-sm text-gray-600">최근 업데이트 정보 없음</p>
      )}
    </div>
  </motion.div>
);

export default CollectionAreaCard;
