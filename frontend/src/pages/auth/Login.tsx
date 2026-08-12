import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";

const LoginPage = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(loginId, password);
    if (!success) {
      setError("로그인에 실패했습니다. 아이디와 비밀번호를 확인해 주세요.");
    }
  };

  return (
    <div className="page-layout narrow auth-layout">
      <PageHeader eyebrow="WELCOME BACK" title="로그인" description="LibrAIry의 스마트 도서관 서비스를 이용하세요." />
      <div className="auth-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="loginId"
              className="block text-sm font-medium text-[var(--color-muted-foreground)] mb-1"
            >
              아이디
            </label>
            <input
              id="loginId"
              type="text"
              required
              className="w-full px-3 py-2 border  border-[var(--color-border)] rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="아이디를 입력하세요"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--color-muted-foreground)] mb-1"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-3 py-2 border  border-[var(--color-border)] rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-orange">{error}</p>}
          <button type="submit" className="primary-action w-full justify-center py-3">
            로그인
          </button>
        </form>
        <div className="mt-6 flex justify-center gap-4 text-center text-sm">
          <Link to="/signup" className="text-orange hover:underline">
            회원가입
          </Link>
          {"  "}
          <Link to="/find-id" className="text-orange hover:underline">
            아이디 찾기
          </Link>
          {"  "}
          <Link to="/find-password" className="text-orange hover:underline">
            비밀번호 찾기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
