import { FC, useEffect, useState } from "react";
import { fetchUserQrCode } from "../services/userService";
import { useAuth } from "../hooks/useAuth";

const QrcodePage: FC = () => {
  const { user } = useAuth();
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    const fetchQrCode = async () => {
      try {
        setLoading(true);
        const qrImageData = await fetchUserQrCode();
        if (qrImageData) {
          setQrImage(qrImageData);
        } else {
          setError("QR 코드를 가져오는 데 실패했습니다.");
        }
      } catch (err) {
        console.error("QR 코드 오류:", err);
        setError("QR 코드를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchQrCode();
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold text-red-500">
          로그인이 필요합니다.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="mb-6 text-3xl font-bold">{user.userName}</h2>
        {loading ? (
          <p className="text-gray-500">로딩 중...</p>
        ) : qrImage ? (
          <div className="p-4 bg-white rounded shadow-md">
            <img src={qrImage} alt="QR 코드" className="w-60 h-60" />
          </div>
        ) : (
          <p className="text-gray-500">QR 코드를 표시할 수 없습니다.</p>
        )}
        <p className="mt-4 text-gray-700">
          QR코드로 책을 대출하실 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default QrcodePage;
