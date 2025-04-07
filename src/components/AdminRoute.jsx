import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getCookie } from "../utils/cookieUtil";

const AdminRoute = ({ children }) => {
  console.log("AdminRoute: Component mounted");

  const [isAdmin, setIsAdmin] = useState(null);
  const token = getCookie("token");
  console.log("AdminRoute: Token:", token ? "exists" : "null");

  useEffect(() => {
    console.log("AdminRoute: useEffect triggered");
    const checkAdminStatus = async () => {
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
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error("AdminRoute: Failed to fetch user info:", error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [token]);

  if (isAdmin === null) return <div>Loading...</div>;

  if (!token || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
