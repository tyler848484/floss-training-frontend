import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const { login, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      login(localStorage.getItem("path"));
    }
  }, []);

  return <div>Signing you in...</div>;
};

export default AuthSuccess;
