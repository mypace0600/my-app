// src/components/LogOutButton.jsx

import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout(); // ✅ 전역에서 제공하는 logout 함수 호출
    navigate("/splash", { replace: true });
  };

  return (
    <button className="btn btn--danger" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
