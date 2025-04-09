// src/routes/ProtectedRoute.jsx

import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, fetched } = useAuth();

  if (!fetched) return <div>인증 확인 중...</div>;

  return user ? children : <Navigate to="/splash" replace />;
};

export default ProtectedRoute;
