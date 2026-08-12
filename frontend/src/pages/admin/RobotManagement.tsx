import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useRobot } from "../../hooks/useRobot";
import RobotCard from "../../components/common/RobotCard";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const RobotManagement: FC = () => {
  const { robots, loading, error } = useRobot();
  const navigate = useNavigate();

  const handleAddRobot = () => {
    navigate("/admin/robot/add");
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-snow to-gray-100">
      <div className="container px-4 mx-auto">
        <div className="flex justify-end mb-6">
          <motion.button
            onClick={handleAddRobot}
            className="flex items-center px-4 py-2 text-white rounded-full bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} className="mr-2" />
            로봇 추가
          </motion.button>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {!loading && robots.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="mb-4 text-xl text-gray-600">
              등록된 로봇이 없습니다.
            </p>
            <motion.button
              onClick={handleAddRobot}
              className="px-4 py-2 text-white rounded-full bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              첫 번째 로봇 추가하기
            </motion.button>
          </div>
        )}

        <AnimatePresence>
          {!loading && robots.length > 0 && (
            <motion.div
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {robots.map((robot) => (
                <motion.div key={robot.id} variants={itemVariants} layout>
                  <RobotCard robot={robot} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RobotManagement;
