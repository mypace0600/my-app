import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Index: Current path:", location.pathname); // 로그 추가
    console.log("Index: Token:", token ? "exists" : "null");

    // 현재 경로가 /admin/*로 시작하는 경우 리다이렉트 방지
    if (location.pathname.startsWith("/admin")) {
      console.log("Index: Skipping redirect for /admin/*");
      return;
    }

    if (token) {
      console.log("Index: Redirecting to /home");
      navigate("/home", { replace: true });
    } else {
      console.log("Index: Redirecting to /splash");
      navigate("/splash", { replace: true });
    }
  }, [navigate, location]);

  return <div>Loading...</div>;
};

export default Index;
