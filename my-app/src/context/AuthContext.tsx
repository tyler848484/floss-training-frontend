import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface AuthContextType {
  isLoggedIn: boolean;
  user: { name: string; email: string; phone_number: string } | null;
  login: () => void;
  logout: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  profileComplete: boolean;
  setProfileComplete: (complete: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    phone_number: string;
  } | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user_name")) {
      login();
    }
  }, []);

  const login = () => {
    axios
      .get("http://localhost:8000/parents/me", { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          const parent = response.data;
          setProfileComplete(!!parent.phone_number);
          localStorage.setItem(
            "user_name",
            parent.first_name + " " + parent.last_name || "User"
          );
          localStorage.setItem("user_email", parent.email || "");
          localStorage.setItem("user_phone", parent.phone_number || "");
          setUser({
            name: parent.first_name + " " + parent.last_name || "",
            email: parent.email || "",
            phone_number: parent.phone_number || "",
          });
          setIsLoggedIn(true);
          setShowLoginModal(false);
          if (parent.phone_number) {
            navigate("/");
          } else {
            navigate("/complete-profile");
          }
        }
      })
      .catch(() => {
        navigate("/");
      });
  };

  const logout = () => {
    axios.post("http://localhost:8000/logout").finally(() => {
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_phone");
      setUser(null);
      setIsLoggedIn(false);
      setShowLoginModal(true);
      navigate("/");
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        showLoginModal,
        setShowLoginModal,
        profileComplete,
        setProfileComplete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
