import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // admin 경로는 리다이렉트 하지 않음
    if (location.pathname.startsWith("/admin")) {
      setLoading(false);
      return;
    }

    const checkLogin = async () => {
      try {
        await axios.get("/api/user", { withCredentials: true });
        console.log("Index: 로그인 상태 - /home 으로 이동");
        navigate("/home", { replace: true });
      } catch (error) {
        console.log("Index: 비로그인 상태 - /splash 으로 이동");
        navigate("/splash", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, [navigate, location]);

  return <div>{loading ? "Loading..." : ""}</div>;
};

export default Index;
