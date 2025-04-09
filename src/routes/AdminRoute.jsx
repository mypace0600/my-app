// src/routes/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, fetched } = useAuth();

  if (!fetched) return <div>관리자 권한 확인 중...</div>;

  return user?.isAdmin ? children : <Navigate to="/splash" replace />;
};

export default AdminRoute;
