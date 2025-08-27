import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User } from "../types";
import { useToast } from "./ToastContext";
import LoadingSpinner from "../components/LoadingSpinner";

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
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
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

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
    setLoading(true);
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
          if (!parent.phone_number) {
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
      .catch(() => {
        showToast("Failed to log in. Please try again.", "danger");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const logout = () => {
    setLoading(true);
    let currentPath = window.location.pathname;
    currentPath === "/complete-profile" && (currentPath = "/");
    axios
      .post("http://localhost:8000/logout")
      .catch(() => {
        showToast("Failed to log out. Please try again.", "danger");
      })
      .finally(() => {
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_phone");
        setUser(null);
        setIsLoggedIn(false);
        setShowLoginModal(true);
        setLoading(false);
        if (currentPath) {
          navigate(currentPath);
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
      {loading && <LoadingSpinner msg="Loading user information..." />}
      {children}
    </AuthContext.Provider>
  );
};
