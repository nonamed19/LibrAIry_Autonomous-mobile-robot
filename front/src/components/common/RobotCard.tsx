import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import type { Robot } from "../../types/robot";
import { motion } from "framer-motion";
import { Activity, AlertCircle, Clock } from "lucide-react";

interface RobotCardProps {
  robot: Robot;
}

const RobotCard: FC<RobotCardProps> = ({ robot }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/admin/robot/${robot.id}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "대기 중":
        return <Clock className="w-5 h-5 mr-2 text-blue" />;
      case "작동 중":
        return <Activity className="w-5 h-5 mr-2 text-green" />;
      case "점검 중":
        return <AlertCircle className="w-5 h-5 mr-2 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      <div className="relative h-48">
        {robot.imageUrl ? (
          <img
            src={robot.imageUrl || "/placeholder.svg"}
            alt={robot.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200">
            <span className="text-gray-600">No Image</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
          <h3 className="text-xl font-bold text-white">{robot.name}</h3>
        </div>
      </div>
      <div className="p-4">
        <p className="mb-2 text-sm text-gray-600">ID: {robot.id}</p>
        <div className="flex items-center">
          {getStatusIcon(robot.status)}
          <p
            className={`text-sm font-medium ${
              robot.status === "대기 중"
                ? "text-blue"
                : robot.status === "작동 중"
                  ? "text-green"
                  : robot.status === "점검 중"
                    ? "text-primary"
                    : "text-gray-600"
            }`}
          >
            {robot.status}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default RobotCard;
