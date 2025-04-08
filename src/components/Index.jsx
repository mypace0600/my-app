import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Index() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const path = location.pathname;

    // 로그인 체크 안할 경로들
    const skipPaths = ["/splash", "/admin", "/login"];
    const shouldSkip = skipPaths.some((skipPath) => path.startsWith(skipPath));

    if (shouldSkip || hasChecked) return;

    const checkLogin = async () => {
      try {
        await axios.get("/api/auth/check", { withCredentials: true });
        console.log("✅ 로그인 상태, /home으로 이동");
        navigate("/home", { replace: true });
      } catch (error) {
        console.log("❌ 비로그인 상태, /splash로 이동");
        navigate("/splash", { replace: true });
      } finally {
        setHasChecked(true); // 다시 체크 못하게 막기
      }
    };

    checkLogin();
  }, [location.pathname, navigate, hasChecked]);

  return null;
}

export default Index;
