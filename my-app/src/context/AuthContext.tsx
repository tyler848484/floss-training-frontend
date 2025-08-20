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
  login: (storedPath: string | null) => void;
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
    const name = localStorage.getItem("user_name");
    const email = localStorage.getItem("user_email");
    const phone = localStorage.getItem("user_phone");
    if (name && email) {
      setUser({ name, email, phone_number: phone ?? "" });
      setIsLoggedIn(true);
      phone && setProfileComplete(true);
    }
  }, []);

  const login = (storedPath: string | null) => {
    axios
      .get("http://localhost:8000/parents/me")
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
          const currentPath = window.location.pathname;
          if (!parent.phone_number && currentPath !== "/complete-profile") {
            navigate("/complete-profile");
          } else {
            if (storedPath) {
              navigate(storedPath);
            } else {
              navigate("/");
            }
          }
        }
      })
      .catch((e) => {
        console.log("Error logging in:", e);
      });
  };

  const logout = () => {
    let currentPath = window.location.pathname;
    currentPath === "/complete-profile" && (currentPath = "/");
    axios.post("http://localhost:8000/logout").finally(() => {
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_phone");
      setUser(null);
      setIsLoggedIn(false);
      setShowLoginModal(true);
      if (currentPath) {
        navigate(currentPath);
      } else {
        navigate("/");
      }
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
