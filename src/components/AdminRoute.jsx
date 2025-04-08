import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auth/check", {
          method: "GET",
          credentials: "include", // 쿠키 자동 포함
        });

        if (response.ok) {
          console.log("✅ AdminRoute: 관리자 인증 성공");
          setIsAdmin(true);
        } else {
          console.warn(
            "⛔ AdminRoute: 인증 실패 - 응답 코드:",
            response.status
          );
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("⛔ AdminRoute: 인증 체크 에러", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (isLoading) {
    return <div>관리자 권한 확인 중...</div>; // or a spinner
  }

  return isAdmin ? children : <Navigate to="/" replace />;
};

export default AdminRoute;
