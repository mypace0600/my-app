// /components/LogOutButton.jsx

import { useNavigate } from "react-router-dom";
import { deleteCookie } from "../utils/cookieUtil";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/custom-logout", {
        method: "POST",
        credentials: "include",
      });

      console.log(res);
      if (res.ok) {
        // 클라이언트 쿠키도 정리 (보안 쿠키면 서버가 해야 함)
        deleteCookie("token");
        deleteCookie("email");

        // 🟡 핵심: /splash 로 직접 이동 (Index를 우회)
        navigate("/splash", { replace: true });
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
