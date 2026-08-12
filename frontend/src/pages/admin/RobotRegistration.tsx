import { FC, useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { insertRobotService } from "../../services/robotService";
import { motion, AnimatePresence } from "framer-motion";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const errorVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

const RobotRegistration: FC = () => {
  const navigate = useNavigate();

  // State for robot name, image, preview, error, and loading
  const [robotName, setRobotName] = useState<string>("");
  const [robotImage, setRobotImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Create a preview URL when a file is selected
  useEffect(() => {
    if (robotImage) {
      const url = URL.createObjectURL(robotImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [robotImage]);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRobotName(e.target.value);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setRobotImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!robotName.trim()) {
      setError("로봇 이름을 입력해주세요.");
      return;
    }
    if (!robotImage) {
      setError("로봇 이미지를 선택해주세요.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("robotImage", robotImage);
      formData.append(
        "robotInsertRequestDto",
        new Blob([JSON.stringify({ robotName })], { type: "application/json" })
      );

      const res = await insertRobotService(formData);

      if (res && res.isDone) {
        alert("로봇 등록이 완료되었습니다.");
        navigate("/admin/robot");
      } else {
        setError("로봇 등록에 실패했습니다.");
      }
    } catch (err) {
      console.error("로봇 등록 실패:", err);
      setError("로봇 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen py-8 bg-snow"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="container max-w-lg px-4 mx-auto">
        <h2 className="p-6 mb-6 text-3xl font-bold text-center">로봇 추가</h2>
        <motion.form
          onSubmit={handleSubmit}
          className="p-6 rounded bg-snow"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: { duration: 0.3 } }}
        >
          <AnimatePresence>
            {error && (
              <motion.p
                className="mb-4 text-red-500"
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
          <div className="mb-4">
            <label className="block mb-2 text-lg font-bold" htmlFor="robotName">
              로봇 이름
            </label>
            <input
              id="robotName"
              type="text"
              value={robotName}
              onChange={handleNameChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="로봇 이름을 입력하세요"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 text-lg font-bold"
              htmlFor="robotImage"
            >
              로봇 이미지
            </label>
            <input
              id="robotImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
              required
              disabled={loading}
            />
          </div>
          {previewUrl && (
            <motion.div
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={previewUrl}
                alt="로봇 이미지 미리보기"
                className="object-cover w-full h-64 rounded"
              />
            </motion.div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-4 transition text-white bg-primary hover:bg-accent disabled:opacity-50 rounded-xl"
          >
            {loading ? "등록 중..." : "로봇 등록"}
          </button>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default RobotRegistration;
