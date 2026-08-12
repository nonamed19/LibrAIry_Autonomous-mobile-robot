import { FC, useEffect, useState } from "react";
import { fetchUserQrCode } from "../services/userService";
import { useAuth } from "../hooks/useAuth";
import { QrCode } from "lucide-react";
import PageHeader from "../components/common/PageHeader";

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
    <div className="page-layout narrow">
      <PageHeader eyebrow="MOBILE MEMBERSHIP" title="모바일 회원증" description="대출 로봇에 아래 QR 코드를 보여 주면 회원 확인이 시작됩니다." />
      <div className="member-card">
        <div className="member-card-icon"><QrCode size={24} /></div>
        <p className="page-eyebrow">{user.userName.toUpperCase()} MEMBER</p>
        <h2>{user.userName}님의 회원증</h2>
        {loading ? (
          <span className="kiosk-spinner member-spinner" />
        ) : qrImage ? (
          <div className="qr-frame">
            <img src={qrImage} alt="QR 코드" className="w-60 h-60" />
          </div>
        ) : (
          <p className="text-gray-500">QR 코드를 표시할 수 없습니다.</p>
        )}
        <p>QR코드는 로그인한 본인만 사용할 수 있습니다.</p>
      </div>
    </div>
  );
};

export default QrcodePage;
