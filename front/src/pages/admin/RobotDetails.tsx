import { type FC, useState, useEffect, useRef, type ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2, Monitor, ChevronDown, ChevronUp } from "lucide-react";
import {
  fetchRobotList,
  fetchRobotLog,
  deleteRobotService,
  updateRobotService,
} from "../../services/robotService";
import type { Robot, RobotLog } from "../../types/robot";

const LOG_BATCH_SIZE = 20;

const RobotDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const robotId = Number(id);
  const navigate = useNavigate();

  const [robot, setRobot] = useState<Robot | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    robot?.imageUrl || null
  );
  const [editedName, setEditedName] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fullLogs, setFullLogs] = useState<RobotLog[]>([]);
  const [displayedLogs, setDisplayedLogs] = useState<RobotLog[]>([]);
  const [logsLoading, setLogsLoading] = useState<boolean>(true);
  const [logsError, setLogsError] = useState<string | null>(null);
  const [isLogsExpanded, setIsLogsExpanded] = useState<boolean>(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetchRobotList();
        if (res && res.robotList && res.robotList.length > 0) {
          const found = res.robotList.find((r) => r.robotId === robotId);
          if (found) {
            const transformed = {
              id: found.robotId ?? 0,
              name: found.robotName || "Unknown Robot",
              imageUrl: found.robotImageUrl,
              status: found.robotStatus || "Unknown",
            };
            setRobot(transformed);
            setEditedName(transformed.name);
          } else {
            setError("로봇 정보를 찾지 못했습니다.");
          }
        } else {
          setError("로봇 정보를 불러오지 못했습니다.");
        }
      } catch (e) {
        console.error("로봇 상세 조회 실패:", e);
        setError("로봇 정보를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, robotId]);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!id) return;
      setLogsLoading(true);
      setLogsError(null);
      try {
        const res = await fetchRobotLog(robotId);
        if (res && res.robotLogList) {
          const logsData: RobotLog[] = res.robotLogList.map((log) => ({
            type: log.robotLogType || "Unknown",
            content: log.robotLogContent || "",
            createdAt: log.robotLogCreatedAt || "",
            completedAt: log.robotLogCompletedAt || undefined,
          }));
          const sortedLogs = logsData.sort((a, b) =>
            b.createdAt.localeCompare(a.createdAt)
          );
          setFullLogs(sortedLogs);
          setDisplayedLogs(sortedLogs.slice(0, LOG_BATCH_SIZE));
        } else {
          setLogsError("활동 로그를 불러오지 못했습니다.");
        }
      } catch (e) {
        console.error(`로봇 로그 조회 실패 (ID: ${robotId}):`, e);
        setLogsError("로봇 로그 조회 중 오류가 발생했습니다.");
      } finally {
        setLogsLoading(false);
      }
    };
    fetchLogs();
  }, [id, robotId]);

  useEffect(() => {
    if (logsLoading) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && displayedLogs.length < fullLogs.length) {
        const currentLength = displayedLogs.length;
        const nextBatch = fullLogs.slice(
          currentLength,
          currentLength + LOG_BATCH_SIZE
        );
        setDisplayedLogs((prev) => [...prev, ...nextBatch]);
      }
    });
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => observer.disconnect();
  }, [logsLoading, displayedLogs, fullLogs]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    if (robot) setEditedName(robot.name);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!robot) return;
    if (!editedName.trim()) {
      alert("로봇 이름은 빈 값이 될 수 없습니다.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append(
        "robotUpdateRequestDto",
        new Blob(
          [JSON.stringify({ robotId: robot.id, robotName: editedName })],
          {
            type: "application/json",
          }
        )
      );
      if (selectedFile) {
        formData.append("robotImage", selectedFile); // Attach new image if selected
      }

      const res = await updateRobotService(formData);
      if (res && res.isDone) {
        alert("로봇 정보가 업데이트되었습니다.");
        setRobot({
          ...robot,
          name: editedName,
          imageUrl: selectedFile
            ? URL.createObjectURL(selectedFile)
            : robot.imageUrl,
        });
        setIsEditing(false);
      } else {
        alert("로봇 정보 업데이트에 실패했습니다.");
      }
    } catch (e) {
      console.error("로봇 업데이트 실패:", e);
      alert("업데이트 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("정말 이 로봇을 삭제하시겠습니까?")) {
      try {
        const res = await deleteRobotService({ robotId });
        if (res && res.isDone) {
          alert("로봇 삭제가 완료되었습니다.");
          navigate("/admin/robot", { replace: true });
        } else {
          alert("로봇 삭제에 실패했습니다.");
        }
      } catch (e) {
        console.error("로봇 삭제 실패:", e);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleRobotScreenOn = () => {
    navigate(`/admin/robot/screen?robotId=${robotId}`);
  };

  const toggleLogsExpanded = () => {
    setIsLogsExpanded(!isLogsExpanded);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  if (error)
    return <div className="p-4 text-orange bg-red-100 rounded-lg">{error}</div>;
  if (!robot)
    return (
      <div className="p-4 text-gray-500 bg-snow rounded-lg">
        로봇 정보가 없습니다.
      </div>
    );

  return (
    <div className="min-h-screen py-8 bg-snow">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-white rounded-lg shadow-lg"
        >
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 mb-4 md:mb-0 md:mr-6">
              {robot.imageUrl ? (
                <img
                  src={robot.imageUrl || "/placeholder.svg"}
                  alt={robot.name}
                  className="object-cover w-full h-64 rounded-lg shadow-md"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-64 bg-snow rounded-lg">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
            </div>
            <div className="w-full md:w-2/3">
              {isEditing ? (
                <div className="mb-4">
                  <label className="block mb-2 text-lg font-semibold text-gray-700">
                    로봇 이름
                    <input
                      type="text"
                      value={editedName}
                      onChange={handleNameChange}
                      className="block w-full p-2 mt-1  rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </label>
                  <label className="block mt-4 text-lg font-semibold text-gray-700">
                    로봇 이미지 변경
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="mt-2"
                    />
                  </label>

                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-40 h-40 mt-2 rounded-lg shadow-md"
                    />
                  )}
                  <div className="mt-4 space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    >
                      취소
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      className="px-4 py-2 text-white bg-blue rounded-md hover:bg-blue-hover focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-50"
                    >
                      저장
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <h2 className="text-3xl font-bold text-gray-800">
                    {robot.name}
                  </h2>
                  <p className="mt-2 text-xl text-gray-600">ID: {robot.id}</p>
                  <p className="mt-2 text-xl text-gray-600">
                    상태: {robot.status}
                  </p>
                  <div className="mt-6 flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleEdit}
                      className="inline-flex items-center px-4 py-2 text-white bg-blue rounded-md hover:bg-blue-hover"
                    >
                      <Edit2 size={18} className="mr-2" />
                      수정
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDelete}
                      className="inline-flex items-center px-4 py-2 text-white bg-primary rounded-md hover:bg-orange-hover"
                    >
                      <Trash2 size={18} className="mr-2" />
                      삭제
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRobotScreenOn}
                      className="inline-flex items-center px-4 py-2 text-white bg-peach rounded-md hover:bg-peach-hover "
                    >
                      <Monitor size={18} className="mr-2" />
                      로봇 화면
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-800">활동 로그</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLogsExpanded}
              className="flex items-center px-3 py-1 text-sm text-snow bg-blue rounded-full hover:bg-blue-hover"
            >
              {isLogsExpanded ? (
                <>
                  <ChevronUp size={16} className="mr-1" />
                  접기
                </>
              ) : (
                <>
                  <ChevronDown size={16} className="mr-1" />
                  펼치기
                </>
              )}
            </motion.button>
          </div>
          <AnimatePresence>
            {isLogsExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  duration: 0.3,
                }}
              >
                {logsLoading && displayedLogs.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="w-8 h-8 border-4 border-blue border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : logsError ? (
                  <div className="p-4 text-primary bg-snow rounded-lg">
                    {logsError}
                  </div>
                ) : displayedLogs.length > 0 ? (
                  <ul className="space-y-3">
                    {displayedLogs.map((log, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="p-4 bg-white  rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <p className="font-semibold text-gray-800">
                          {log.type}
                        </p>
                        <p className="mt-1 text-gray-600">{log.content}</p>
                        <p className="mt-2 text-xs text-gray-500">
                          생성: {new Date(log.createdAt).toLocaleString()}
                        </p>
                        {log.completedAt && (
                          <p className="text-xs text-gray-500">
                            완료: {new Date(log.completedAt).toLocaleString()}
                          </p>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-gray-500 bg-snow rounded-lg">
                    활동 로그가 없습니다.
                  </div>
                )}
                <div ref={observerRef} className="h-8"></div>
                {logsLoading && displayedLogs.length > 0 && (
                  <div className="flex items-center justify-center h-16">
                    <div className="w-8 h-8 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default RobotDetail;
