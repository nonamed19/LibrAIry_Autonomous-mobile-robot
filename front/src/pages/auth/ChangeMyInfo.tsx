import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { changePasswordService } from "../../services/userService";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  ...props
}) => (
  <button
    className={`px-4 py-2 bg-orange text-white rounded hover:bg-orange-hover focus:outline-none focus:ring-2 focus:ring-peach focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {children}
  </button>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input: React.FC<InputProps> = ({ className = "", ...props }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-peach ${className}`}
    {...props}
  />
);

const Label: React.FC<{
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}> = ({ children, className = "", ...props }) => (
  <label
    className={`block text-sm font-medium text-gray-700 ${className}`}
    {...props}
  >
    {children}
  </label>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div className={`bg-snow rounded-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-6 py-4">{children}</div>
);

const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-6 py-4">{children}</div>
);

export default function ChangePassword() {
  const { user, withdraw } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <div className="mt-10 text-center">먼저 로그인 해주세요.</div>;
  }

  const handleCurrentPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await changePasswordService({
        userId: user.userId,
        userPassword: currentPassword,
        action: 0,
      });

      if (response && response.isDone) {
        setStep(2);
        showToast(
          "현재 비밀번호 확인 완료. 새 비밀번호를 입력해주세요.",
          "success"
        );
      } else {
        showToast("현재 비밀번호가 올바르지 않습니다.", "error");
      }
    } catch {
      showToast(
        "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      showToast("새 비밀번호와 재입력 비밀번호가 일치하지 않습니다.", "error");
      setLoading(false);
      return;
    }

    try {
      const updateResponse = await changePasswordService({
        userId: user.userId,
        userPassword: newPassword,
        action: 1,
      });

      if (updateResponse && updateResponse.isDone) {
        navigate("/", {
          state: {
            message: "비밀번호가 성공적으로 변경되었습니다.",
            type: "success",
          },
          replace: true,
        });
      } else {
        showToast("비밀번호 변경에 실패했습니다. 다시 시도해주세요.", "error");
      }
    } catch {
      showToast(
        "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const confirmed = window.confirm("정말로 회원 탈퇴하시겠습니까?");
    if (confirmed) {
      await withdraw();
      showToast("회원 탈퇴가 완료되었습니다.", "success");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-snow">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-bold">내 정보 관리</h2>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleCurrentPasswordSubmit}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">현재 비밀번호</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "확인 중..." : "다음"}
                  </Button>
                </div>
              </motion.form>
            )}
            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleNewPasswordSubmit}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">새 비밀번호</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">새 비밀번호 재입력</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "변경 중..." : "비밀번호 변경"}
                  </Button>
                  <button onClick={handleWithdraw} style={{ color: "red" }}>
                    회원 탈퇴
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
