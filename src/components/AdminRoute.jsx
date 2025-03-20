import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  console.log("AdminRoute: Component mounted"); // 최상단 로그

  const [isAdmin, setIsAdmin] = useState(null);
  const token = localStorage.getItem("token");
  console.log("AdminRoute: Token:", token ? "exists" : "null");

  useEffect(() => {
    console.log("AdminRoute: useEffect triggered");
    const checkAdminStatus = async () => {
      console.log(
        "AdminRoute: Starting fetch with token:",
        token ? "exists" : "null"
      );
      if (!token) {
        console.log("AdminRoute: No token found");
        setIsAdmin(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/api/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("AdminRoute: Response status:", res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log("AdminRoute: Received data:", data);
        console.log("AdminRoute: Setting isAdmin to:", data);
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error("AdminRoute: Failed to fetch user info:", error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [token]);

  console.log("AdminRoute: Current isAdmin value:", isAdmin);

  if (isAdmin === null) {
    console.log("AdminRoute: Rendering loading state");
    return <div>Loading...</div>;
  }

  if (!token || !isAdmin) {
    console.log("AdminRoute: Redirecting to / due to:", {
      token: token ? "exists" : "null",
      isAdmin,
    });
    return <Navigate to="/" replace />;
  }

  console.log("AdminRoute: Rendering children, user is admin");
  return children;
};

export default AdminRoute;
