import { type FC, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, AlertCircle } from "lucide-react";
import {
  fetchArriveZoneInfo,
  resetArriveZoneService,
} from "../../services/arriveZoneService";
import CollectionAreaCard from "../../components/admin/CollectionAreaCard";

export interface CollectionArea {
  arriveZoneId: number;
  arriveZoneName: string;
  arriveZoneBook: number;
  arriveZoneTime?: string;
}

const CollectionStatus: FC = () => {
  const [areas, setAreas] = useState<CollectionArea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAreas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchArriveZoneInfo();
      if (res && res.arriveZoneList) {
        const transformed: CollectionArea[] = res.arriveZoneList.map(
          (zone) => ({
            arriveZoneId: zone.arriveZoneId ?? 0,
            arriveZoneName: zone.arriveZoneName || "미지정 구역",
            arriveZoneBook: zone.arriveZoneBook ?? 0,
            arriveZoneTime: zone.arriveZoneTime,
          })
        );
        setAreas(transformed);
      } else {
        setError("회수 구역 정보를 불러오지 못했습니다.");
      }
    } catch (e) {
      console.error("회수 구역 조회 실패:", e);
      setError("회수 구역 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAreas();
  }, []);

  const handleReset = async (zoneId: number) => {
    if (!window.confirm("해당 회수 구역의 상태를 리셋하시겠습니까?")) return;
    try {
      const res = await resetArriveZoneService({ arriveZoneId: zoneId });
      if (res && res.isDone) {
        alert("회수 구역 상태가 리셋되었습니다.");
        loadAreas();
      } else {
        alert("회수 구역 상태 리셋에 실패했습니다.");
      }
    } catch (e) {
      console.error("회수 구역 리셋 실패:", e);
      alert("회수 구역 상태를 리셋하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen py-12 bg-snow">
      <div className="container px-4 mx-auto">
        {loading ? (
          <div className="flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <RefreshCw className="w-12 h-12 text-blue" />
            </motion.div>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-lg bg-snow"
          >
            <div className="flex items-center text-red-700">
              <AlertCircle className="w-6 h-6 mr-2" />
              <p>{error}</p>
            </div>
          </motion.div>
        ) : areas.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600"
          >
            회수 구역 정보가 없습니다.
          </motion.p>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {areas.map((area) => (
                <motion.div key={area.arriveZoneId} layout className="relative">
                  <CollectionAreaCard
                    areaName={area.arriveZoneName}
                    bookCount={area.arriveZoneBook}
                    updateTime={area.arriveZoneTime}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 1.0 }}
                    onClick={() => handleReset(area.arriveZoneId)}
                    className="absolute px-3 py-1 text-sm font-medium text-white transition-colors duration-200 rounded-full bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 top-2 right-2"
                  >
                    리셋
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default CollectionStatus;
