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

const getStoredUser = (): User | null => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    return null;
  }

  try {
    const user: unknown = JSON.parse(storedUser);
    if (
      typeof user === "object" &&
      user !== null &&
      "userId" in user &&
      "userName" in user &&
      typeof user.userId === "number" &&
      typeof user.userName === "string"
    ) {
      return user as User;
    }
  } catch {
    // Invalid browser storage must not prevent the application from starting.
  }

  localStorage.removeItem("user");
  return null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(getStoredUser);

  useEffect(() => {
    if (!token || !user) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    }
  }, [token, user]);

  const login = async (loginId: string, password: string): Promise<boolean> => {
    const result = await userLoginService({
      userLoginId: loginId,
      userPassword: password,
    });
    if (result) {
      setToken(localStorage.getItem("token"));
      setUser(getStoredUser());
      navigate("/");
      return true;
    }
    return false;
  };

  const logout = async () => {
    await userLogoutService();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/");
  };

  const withdraw = async () => {
    const result = await userWithdrawalService();
    if (result) {
      logout();
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
