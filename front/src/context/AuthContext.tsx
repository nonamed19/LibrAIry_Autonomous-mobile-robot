import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  userLoginService,
  userLogoutService,
  userWithdrawalService,
} from "../services/userService";
import { User } from "../types/user";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (loginId: string, password: string) => Promise<boolean>;
  logout: () => void;
  withdraw: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (loginId: string, password: string): Promise<boolean> => {
    const result = await userLoginService({
      userLoginId: loginId,
      userPassword: password,
    });
    if (result) {
      setToken(localStorage.getItem("token"));
      setUser(JSON.parse(localStorage.getItem("user") || ""));
      navigate("/");
      return true;
    }
    return false;
  };

  const logout = async () => {
    await userLogoutService();
    localStorage.clear();
    setToken(null);
    setUser(null);
    navigate("/");
  };

  const withdraw = async () => {
    const result = await userWithdrawalService();
    if (result) {
      console.log("회원탈퇴 성공");
      logout();
    } else {
      console.log("회원탈퇴 실패");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        withdraw,
        isAdmin: user?.isAdmin || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
