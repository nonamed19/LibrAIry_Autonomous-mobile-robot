import React, { useState } from "react";
import { searchIdService } from "../../services/userService";
import { useToast } from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";

const FindId: React.FC = () => {
  const [userEmail, setUserEmail] = useState("");
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResultMessage(null);

    try {
      const response = await searchIdService({ userEmail });
      if (response && response.isDone) {
        setResultMessage("아이디가 이메일로 발송되었습니다.");
        showToast("아이디가 성공적으로 발송되었습니다.", "success");
      } else {
        showToast(
          "아이디 찾기에 실패했습니다. 입력 정보를 다시 확인해주세요.",
          "error"
        );
      }
    } catch (err) {
      console.error("아이디 찾기 실패:", err);
      showToast(
        "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-snow">
      <div className="w-full max-w-md p-6 bg-snow rounded">
        <h2 className="mb-4 text-2xl font-bold text-center">아이디 찾기</h2>

        {resultMessage && (
          <div className="mb-4 text-center text-blue">{resultMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="userEmail" className="block mb-1">
              이메일
            </label>
            <input
              type="email"
              id="userEmail"
              className="w-full p-2 border border-gray-300 rounded"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
          </div>

          <button
            type={resultMessage ? "button" : "submit"}
            onClick={resultMessage ? handleLoginRedirect : undefined}
            className="w-full p-2 text-white bg-orange rounded hover:bg-orange-hover"
            disabled={loading}
          >
            {loading
              ? "확인 중..."
              : resultMessage
                ? "로그인 하러 가기"
                : "아이디 찾기"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FindId;
