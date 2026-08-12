import { useState, useEffect } from "react";
import { fetchRobotList, fetchRobotLog } from "../services/robotService"; // 서비스 함수 (백엔드 API 호출)
import type { Robot, RobotLog } from "../types/robot";

/**
 * 백엔드 API를 통해 로봇 리스트를 가져온 후, types/robot.ts에 정의된 Robot 도메인 모델로 변환하여 반환
 */
export const useRobot = (): {
  robots: Robot[];
  loading: boolean;
  error: string | null;
} => {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchRobotList();
        if (res && res.robotList && res.robotList.length > 0) {
          // 백엔드에서 받은 RobotDto를 도메인 모델 Robot으로 변환
          const transformed: Robot[] = res.robotList.map((r) => ({
            id: r.robotId ?? 0,
            name: r.robotName || "Unknown Robot",
            imageUrl: r.robotImageUrl,
            status: r.robotStatus || "Unknown",
          }));
          setRobots(transformed);
        } else {
          setError("로봇 리스트를 불러오지 못했습니다.");
        }
      } catch (err) {
        console.error("로봇 리스트 조회 실패:", err);
        setError("로봇 리스트 조회 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { robots, loading, error };
};

/**
 * 특정 로봇의 로그 데이터를 백엔드에서 가져와 types/robot.ts에 정의된 RobotLog 도메인 모델로 변환하여 반환
 */
export const useRobotLog = (
  robotId: number
): {
  logs: RobotLog[];
  loading: boolean;
  error: string | null;
} => {
  const [logs, setLogs] = useState<RobotLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!robotId) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchRobotLog(robotId);
        if (res && res.robotLogList && res.robotLogList.length > 0) {
          // 백엔드의 RobotLogDto를 도메인 모델 RobotLog으로 변환
          const transformed: RobotLog[] = res.robotLogList.map((log) => ({
            type: log.robotLogType || "Unknown",
            content: log.robotLogContent || "",
            createdAt: log.robotLogCreatedAt || "",
            completedAt: log.robotLogCompletedAt || undefined,
          }));
          setLogs(transformed);
        } else {
          setError("로봇 로그를 불러오지 못했습니다.");
        }
      } catch (err) {
        console.error(`로봇 로그 조회 실패 (ID: ${robotId}):`, err);
        setError("로봇 로그 조회 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [robotId]);

  return { logs, loading, error };
};
